import { Component, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Splat } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls the splat transparency mode and alpha threshold.
export const useSplatStore = create((set) => ({ alphaTest: 0.1, alphaHash: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ alphaTest: 0.1, alphaHash: false }) }))

// The boundary displays resource or WebGL errors instead of a blank lesson.
class SplatBoundary extends Component {
  constructor (props) { super(props); this.state = { error: false } }
  static getDerivedStateFromError () { return { error: true } }
  render () { return this.state.error ? <p role='alert' className='p-6 text-sm text-red-700'>{this.props.message}</p> : this.props.children }
}

// The isolated canvas loads a local synthetic Gaussian splat asset.
function SplatContent () {
  const { t } = useTranslation()
  const { alphaTest, alphaHash, reset } = useSplatStore()
  const [resource, setResource] = useState({ url: null, failed: false })
  useEffect(() => { reset(); return () => reset() }, [reset])
  useEffect(() => {
    const controller = new AbortController()
    let objectUrl
    async function loadAsset () {
      try {
        const url = `${import.meta.env.BASE_URL}models/synthetic-orbit.splat`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error('Failed to fetch splat asset')
        const buffer = await response.arrayBuffer()
        if (buffer.byteLength !== 1800 * 32) throw new Error('Invalid splat asset')
        if (controller.signal.aborted) return
        // A fresh URL prevents Drei from reusing a loader tied to a previous Canvas.
        objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'application/octet-stream' }))
        setResource({ url: objectUrl, failed: false })
      } catch (error) {
        if (!controller.signal.aborted) setResource({ url: null, failed: true })
      }
    }
    loadAsset()
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [])
  return <div role='group' aria-label={t('splatUI.scene')} className='relative h-screen w-screen overflow-hidden'><SplatBoundary message={t('splatUI.error')}>{resource.url && <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><Suspense fallback={null}><Splat src={resource.url} alphaTest={alphaTest} alphaHash={alphaHash} /></Suspense><OrbitControls makeDefault minDistance={3} maxDistance={12} /></Canvas>}<p role={resource.failed ? 'alert' : 'status'} className='absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs text-indigo-700'>{resource.failed ? t('splatUI.error') : resource.url ? t('splatUI.ready') : t('splatUI.loading')}</p></SplatBoundary></div>
}

// The child document receives rendering settings from the lesson that owns it.
export function SplatFrame () {
  useEffect(() => {
    const receive = (event) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'drei-splat-settings') return
      const { alphaTest, alphaHash } = event.data
      if (typeof alphaTest !== 'number' || alphaTest < 0 || alphaTest > 0.9 || typeof alphaHash !== 'boolean') return
      useSplatStore.setState({ alphaTest, alphaHash })
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: 'drei-splat-ready' }, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [])
  return <SplatContent />
}

// The iframe confines Drei's loader cache and worker to the lifetime of the demo.
export default function SplatDemo () {
  const { t } = useTranslation()
  const frame = useRef(null)
  const { alphaTest, alphaHash, reset } = useSplatStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  useEffect(() => {
    const send = () => frame.current?.contentWindow?.postMessage({ type: 'drei-splat-settings', alphaTest, alphaHash }, window.location.origin)
    const receive = (event) => { if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'drei-splat-ready') send() }
    window.addEventListener('message', receive)
    send()
    return () => window.removeEventListener('message', receive)
  }, [alphaTest, alphaHash])
  return <div className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><iframe ref={frame} title={t('splatUI.scene')} src={`${window.location.pathname}${window.location.search}#/splat-frame`} className='size-full border-0' /></div>
}

// The panel compares alpha testing with hashed transparency.
export function SplatPanel () {
  const { t } = useTranslation()
  const { alphaTest, alphaHash, setValue, reset } = useSplatStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('splatUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('splatUI.alphaTest')}</span><span>{alphaTest}</span></span><input type='range' min='0' max='0.9' step='0.05' value={alphaTest} disabled={alphaHash} onChange={(event) => setValue('alphaTest', Number(event.target.value))} className='w-full accent-indigo-600 disabled:opacity-40' /></label><Button aria-pressed={alphaHash} onClick={() => setValue('alphaHash', !alphaHash)} className='w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(alphaHash ? 'splatUI.hashOn' : 'splatUI.hashOff')}</Button></section>
}
