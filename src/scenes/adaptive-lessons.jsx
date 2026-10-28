import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// Stable Canvas settings prevent React updates from resetting the adaptive DPR.
const canvasDpr = [1, 2]

// The regression settings keep the lower state visible for inspection.
const canvasPerformance = { min: 0.5, debounce: 8000 }

// The store requests performance regressions and reports the renderer's real state.
export const useAdaptiveStore = create((set) => ({ request: 0, current: 1, dpr: 1, events: true, clicks: 0, revision: 0, regress: () => set((state) => ({ request: state.request + 1 })), clicked: () => set((state) => ({ clicks: state.clicks + 1 })), report: (values) => set(values), reset: () => set((state) => ({ request: 0, current: 1, dpr: 1, events: true, clicks: 0, revision: state.revision + 1 })) }))

// The observer invokes R3F regression and reports performance, DPR and event state.
function AdaptiveObserver () {
  const request = useAdaptiveStore((state) => state.request)
  const report = useAdaptiveStore((state) => state.report)
  const regress = useThree((state) => state.performance.regress)
  const current = useThree((state) => state.performance.current)
  const dpr = useThree((state) => state.viewport.dpr)
  const events = useThree((state) => state.events.enabled)
  const initial = useRef(true)
  useEffect(() => { if (initial.current) { initial.current = false; return } regress() }, [request, regress])
  useEffect(() => { report({ current, dpr, events }) }, [current, dpr, events, report])
  return null
}

// The scene applies one adaptive helper and offers a pointer-event target.
function AdaptiveScene () {
  const { name } = useParams()
  const clicked = useAdaptiveStore((state) => state.clicked)
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, 2, -4]} intensity={0.8} /><mesh onClick={clicked} rotation={[0.3, 0.4, 0]}><torusKnotGeometry args={[1, 0.35, 160, 24]} /><meshStandardMaterial color='#6366f1' /></mesh>{name === 'AdaptiveDpr' ? <AdaptiveDpr pixelated /> : <AdaptiveEvents />}<AdaptiveObserver /></>
}

// The canvas uses a longer regression interval so the state can be inspected.
export default function AdaptiveDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const revision = useAdaptiveStore((state) => state.revision)
  const reset = useAdaptiveStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('adaptiveUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas key={revision} camera={{ position: [0, 0, 6], fov: 45 }} dpr={canvasDpr} performance={canvasPerformance}><AdaptiveScene /></Canvas></div>
}

// The panel triggers a temporary regression and exposes the actual R3F state.
export function AdaptivePanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { current, dpr, events, clicks, regress, reset } = useAdaptiveStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('adaptiveUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><Button onClick={regress} className='w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white'>{t('adaptiveUI.regress')}</Button><div role='status' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'><p>{t('adaptiveUI.current')}: {current}</p><p>DPR: {dpr.toFixed(2)}</p><p>{t('adaptiveUI.events')}: {t(events ? 'adaptiveUI.on' : 'adaptiveUI.off')}</p>{name === 'AdaptiveEvents' && <p>{t('adaptiveUI.clicks')}: {clicks}</p>}</div><p className='text-xs leading-6 text-slate-500'>{t(name === 'AdaptiveEvents' ? 'adaptiveUI.eventHint' : 'adaptiveUI.dprHint')}</p></section>
}
