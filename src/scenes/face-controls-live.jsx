import { Component, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { FaceControls, FaceLandmarker, FaceLandmarkerDefaults } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { clear, preload } from 'suspend-react'

// The boundary displays detector or camera failures without trapping the user.
class LiveFaceBoundary extends Component {
  constructor (props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError () { return { failed: true } }
  componentDidCatch () { this.props.onError() }
  render () { return this.state.failed ? <p role='alert' className='p-4 text-sm text-rose-700'>{this.props.message}</p> : this.props.children }
}

// The scene provides depth cues for a camera driven by live face tracking.
function LiveFaceScene ({ onPosition }) {
  const camera = useThree((state) => state.camera)
  const last = useRef(0)
  useFrame((state) => {
    if (state.clock.elapsedTime - last.current < 0.5) return
    last.current = state.clock.elapsedTime
    onPosition(camera.position.toArray().map((value) => value.toFixed(2)).join(', '))
  })
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 2]} intensity={3} /><mesh position={[-1.4, 0.2, -4]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='#6366f1' /></mesh><mesh position={[1.4, 0.2, -5]}><sphereGeometry args={[0.7, 32, 24]} /><meshStandardMaterial color='#f59e0b' /></mesh><mesh position={[0, -1.1, -6]}><boxGeometry args={[6, 0.15, 1]} /><meshStandardMaterial color='#a5b4fc' /></mesh><FaceControls smoothTime={0.25} offset /></>
}

// The page waits for an explicit start before initializing detection and webcam capture.
export default function FaceControlsLive () {
  const { t } = useTranslation()
  const [started, setStarted] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const [sampleError, setSampleError] = useState(false)
  const [sample, setSample] = useState(false)
  const [loadingSample, setLoadingSample] = useState(false)
  const [position, setPosition] = useState('')
  const stream = useRef(null)
  const timer = useRef(null)
  const bitmap = useRef(null)
  const alive = useRef(true)
  const options = { ...FaceLandmarkerDefaults.options, baseOptions: { ...FaceLandmarkerDefaults.options.baseOptions, delegate: 'CPU' } }
  const release = () => { alive.current = false; clearInterval(timer.current); bitmap.current?.close(); stream.current?.getTracks().forEach((track) => track.stop()) }
  useEffect(() => {
    const onPageHide = () => release()
    window.addEventListener('pagehide', onPageHide)
    return () => { window.removeEventListener('pagehide', onPageHide); release() }
  }, [])
  const start = () => {
    if (!navigator.mediaDevices?.getUserMedia || !HTMLVideoElement.prototype.requestVideoFrameCallback) { setUnsupported(true); return }
    setUnsupported(false)
    try {
      const request = navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      preload(() => request.then((value) => { if (alive.current) stream.current = value; else value.getTracks().forEach((track) => track.stop()); return value }), [])
      setStarted(true)
    } catch { setUnsupported(true) }
  }
  const startSample = async () => {
    if (!HTMLVideoElement.prototype.requestVideoFrameCallback) { setUnsupported(true); return }
    setLoadingSample(true)
    setSampleError(false)
    try {
      const response = await fetch('https://storage.googleapis.com/mediapipe-assets/business-person.png')
      if (!response.ok) throw new Error('Sample unavailable')
      const image = await createImageBitmap(await response.blob())
      if (!alive.current) { image.close(); return }
      bitmap.current = image
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 360
      const context = canvas.getContext('2d')
      if (!context || !canvas.captureStream) throw new Error('Video capture unavailable')
      const width = image.width * 340 / image.height
      const startTime = performance.now()
      const draw = () => {
        context.fillStyle = '#eef2ff'
        context.fillRect(0, 0, 640, 360)
        context.drawImage(image, (640 - width) / 2 + Math.sin((performance.now() - startTime) / 1800) * 90, 10, width, 340)
      }
      draw()
      const value = canvas.captureStream(15)
      stream.current = value
      timer.current = setInterval(draw, 1000 / 15)
      preload(() => Promise.resolve(value), [])
      setSample(true)
      setStarted(true)
      setLoadingSample(false)
    } catch { release(); alive.current = true; setLoadingSample(false); setSampleError(true) }
  }
  const stop = () => { release(); clear([]); window.location.reload() }
  return <div className='flex h-screen flex-col gap-3 bg-indigo-50 p-4'><div className='min-h-0 flex-1 overflow-hidden rounded-xl border border-indigo-100 bg-white'><LiveFaceBoundary message={t('faceControlsUI.liveError')} onError={release}><Suspense fallback={<p role='status' className='p-4 text-sm text-slate-600'>{t('faceControlsUI.liveLoading')}</p>}>{started && <FaceLandmarker options={options}><Canvas camera={{ position: [0, 0, 0.5], fov: 50 }}><LiveFaceScene onPosition={setPosition} /></Canvas></FaceLandmarker>}</Suspense></LiveFaceBoundary></div><div className='flex flex-wrap items-center gap-3'><Button disabled={loadingSample} onClick={() => { if (started) stop(); else start() }} className='cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-xs text-white focus-visible:outline-2'>{t(started ? 'faceControlsUI.liveStop' : 'faceControlsUI.liveStart')}</Button>{!started && <Button disabled={loadingSample} onClick={startSample} className='cursor-pointer rounded-lg border border-indigo-200 bg-white px-4 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t(loadingSample ? 'faceControlsUI.liveSampleLoading' : 'faceControlsUI.liveSample')}</Button>}<p role={unsupported || sampleError ? 'alert' : undefined} className='text-xs leading-6 text-slate-600'>{t(unsupported ? 'faceControlsUI.liveUnsupported' : sampleError ? 'faceControlsUI.liveError' : started ? (sample ? 'faceControlsUI.liveSampleActive' : 'faceControlsUI.liveActive') : 'faceControlsUI.liveHint')}</p>{started && position && <p className='font-mono text-xs text-indigo-700'>{t('faceControlsUI.camera')}: {position} m</p>}</div></div>
}
