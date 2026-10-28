import { Component, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { flushSync } from 'react-dom'
import { clear, preload } from 'suspend-react'
import { ScreenVideoTexture, WebcamVideoTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

// The boundary shows a denied permission or unsupported capture error.
class CaptureBoundary extends Component {
  constructor (props) { super(props); this.state = { failed: false, reason: '' } }
  static getDerivedStateFromError (error) { return { failed: true, reason: error?.name || '' } }
  componentDidCatch (error) { this.props.onError(error?.name || '') }
  render () { return this.state.failed ? <p role='alert' className='rounded-lg bg-rose-50 p-4 text-sm text-rose-700'>{this.props.message} {this.state.reason && `(${this.state.reason})`}</p> : this.props.children }
}

// The surface displays the stream and observes when its video track ends.
function CaptureSurface ({ texture, onReady, onEnded }) {
  useEffect(() => {
    const tracks = texture.image.srcObject?.getVideoTracks() || []
    tracks.forEach((track) => track.addEventListener('ended', onEnded))
    onReady()
    return () => { tracks.forEach((track) => track.removeEventListener('ended', onEnded)) }
  }, [texture, onReady, onEnded])
  return <mesh><planeGeometry args={[4.8, 2.7]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
}

// The frame runs the real Drei capture component in its own document lifetime.
export default function MediaCaptureFrame () {
  const { t } = useTranslation()
  const screen = window.location.hash === '#/capture-screen'
  const [status, setStatus] = useState('idle')
  const [sample, setSample] = useState(false)
  const [errorName, setErrorName] = useState('')
  const [caughtByBoundary, setCaughtByBoundary] = useState(false)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const alive = useRef(true)
  useEffect(() => {
    const release = () => { alive.current = false; clearInterval(timerRef.current); streamRef.current?.getTracks().forEach((track) => track.stop()) }
    window.addEventListener('pagehide', release)
    return () => { window.removeEventListener('pagehide', release); release() }
  }, [])
  const active = status === 'requesting' || status === 'ready'
  const ready = () => setStatus('ready')
  const ended = () => setStatus('ended')
  const start = (simulateDenial = false) => {
    try {
      const request = simulateDenial ? Promise.reject(new DOMException('Simulated denial', 'NotAllowedError')) : screen ? navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }) : navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      preload(() => request.then((stream) => { if (!alive.current) stream.getTracks().forEach((track) => track.stop()); else streamRef.current = stream; return stream }), [])
      flushSync(() => setStatus('requesting'))
    } catch (error) {
      setErrorName(error?.name || 'Error')
      setStatus('error')
    }
  }
  const stop = () => {
    alive.current = false
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    clear([])
    window.location.reload()
  }
  const startSample = () => {
    setSample(true)
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 360
    const context = canvas.getContext('2d')
    if (!context || !canvas.captureStream) { setStatus('error'); return }
    const started = performance.now()
    const draw = () => {
      const x = 320 + Math.sin((performance.now() - started) / 700) * 210
      context.fillStyle = '#e0e7ff'
      context.fillRect(0, 0, 640, 360)
      context.fillStyle = '#4f46e5'
      context.beginPath()
      context.arc(x, 180, 45, 0, Math.PI * 2)
      context.fill()
    }
    draw()
    const stream = canvas.captureStream(15)
    streamRef.current = stream
    timerRef.current = setInterval(draw, 1000 / 15)
    preload(() => Promise.resolve(stream), [])
    setStatus('requesting')
  }
  const component = screen ? <ScreenVideoTexture options={{ video: true, audio: false }} muted playsInline>{(texture) => <CaptureSurface texture={texture} onReady={ready} onEnded={ended} />}</ScreenVideoTexture> : <WebcamVideoTexture constraints={{ video: true, audio: false }} muted playsInline>{(texture) => <CaptureSurface texture={texture} onReady={ready} onEnded={ended} />}</WebcamVideoTexture>
  return <div className='flex h-screen min-h-0 flex-col gap-3 bg-indigo-50 p-4'><div className='min-h-0 flex-1 overflow-hidden rounded-xl border border-indigo-100 bg-white'><CaptureBoundary message={t('captureUI.error')} onError={(name) => { setCaughtByBoundary(true); setErrorName(name); setStatus('error') }}><Canvas camera={{ position: [0, 0, 6], fov: 50 }}><color attach='background' args={['#eef2ff']} /><Suspense fallback={null}>{active && component}</Suspense></Canvas></CaptureBoundary></div><div className='flex flex-wrap items-center gap-3'><Button onClick={() => { if (status === 'idle') start(); else stop() }} className='cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-xs text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(status === 'idle' ? (screen ? 'captureUI.startScreen' : 'captureUI.startCamera') : status === 'ready' ? 'captureUI.stop' : status === 'requesting' ? 'captureUI.cancel' : 'captureUI.retry')}</Button>{status === 'idle' && <><Button onClick={startSample} className='cursor-pointer rounded-lg border border-indigo-200 bg-white px-4 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t('captureUI.sampleStream')}</Button><Button onClick={() => start(true)} className='cursor-pointer rounded-lg border border-indigo-200 bg-white px-4 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t('captureUI.simulateDenial')}</Button></>}{(status !== 'error' || !caughtByBoundary || errorName === 'InvalidStateError') && <p role='status' className='text-xs text-slate-600'>{t(status === 'error' && errorName === 'InvalidStateError' ? 'captureUI.activationError' : sample && status === 'ready' ? 'captureUI.samplePlaying' : `captureUI.${status}`)}</p>}</div></div>
}
