import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor, usePerformanceMonitor } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares the artificial load and actual monitor callbacks with the panel.
export const useMonitorStore = create((set) => ({ heavy: false, fps: null, factor: 0.5, trend: 'waiting', revision: 0, toggle: () => set((state) => ({ heavy: !state.heavy })), report: (trend, api) => set({ trend, fps: api.fps, factor: api.factor }), reset: () => set((state) => ({ heavy: false, fps: null, factor: 0.5, trend: 'waiting', revision: state.revision + 1 })) }))

// The hook subscribes to the monitor context and records its actual callbacks.
function MonitorSubscriber () {
  const report = useMonitorStore((state) => state.report)
  usePerformanceMonitor({ onIncline: (api) => report('incline', api), onDecline: (api) => report('decline', api) })
  return null
}

// The load deliberately spends time on the main thread to lower frame rate for comparison.
function MonitorScene () {
  const mesh = useRef()
  const heavy = useMonitorStore((state) => state.heavy)
  useFrame((_, delta) => { mesh.current.rotation.y += delta * 0.5; if (heavy) { const start = performance.now(); while (performance.now() - start < 40) {} } })
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-3, 2, -4]} intensity={0.8} /><mesh ref={mesh}><torusKnotGeometry args={[1, 0.35, 120, 20]} /><meshStandardMaterial color='#818cf8' /></mesh></>
}

// The monitor receives callbacks directly or through the dedicated hook.
function MonitoredScene () {
  const { name } = useParams()
  const report = useMonitorStore((state) => state.report)
  const callbacks = name === 'PerformanceMonitor' ? { onIncline: (api) => report('incline', api), onDecline: (api) => report('decline', api) } : {}
  return <PerformanceMonitor iterations={4} ms={250} threshold={0.5} step={0.1} bounds={() => [40, 55]} {...callbacks}>{name === 'usePerformanceMonitor' && <MonitorSubscriber />}<MonitorScene /></PerformanceMonitor>
}

// The canvas remounts the monitor when reset to clear its sample history.
export default function MonitorDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const revision = useMonitorStore((state) => state.revision)
  const reset = useMonitorStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('monitorUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas key={revision} camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}><MonitoredScene /></Canvas></div>
}

// The panel toggles artificial load and shows measured FPS, factor and callback direction.
export function MonitorPanel () {
  const { t } = useTranslation()
  const { heavy, fps, factor, trend, toggle, reset } = useMonitorStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('monitorUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><Button aria-pressed={heavy} onClick={toggle} className='w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(heavy ? 'monitorUI.heavy' : 'monitorUI.light')}</Button><div role='status' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'><p>{t('monitorUI.fps')}: {fps ?? '—'}</p><p>{t('monitorUI.factor')}: {factor.toFixed(1)}</p><p>{t('monitorUI.trend')}: {t(`monitorUI.${trend}`)}</p></div><p className='text-xs leading-6 text-slate-500'>{t('monitorUI.hint')}</p></section>
}
