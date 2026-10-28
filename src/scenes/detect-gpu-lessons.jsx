import { Component, Suspense, useEffect } from 'react'
import { DetectGPU, useDetectGPU } from '@react-three/drei'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The local benchmark files match the installed detect-gpu version.
const options = { benchmarksURL: `${import.meta.env.BASE_URL}benchmarks` }

// The store shares the detected result with the adjacent lesson panel.
export const useGpuLessonStore = create((set) => ({ result: null, setResult: (result) => set({ result }), reset: () => set({ result: null }) }))

// The boundary displays a detection failure if the asynchronous hook rejects.
class GpuBoundary extends Component {
  constructor (props) { super(props); this.state = { error: false } }
  static getDerivedStateFromError () { return { error: true } }
  render () { return this.state.error ? <p role='alert' className='text-sm text-red-700'>{this.props.message}</p> : this.props.children }
}

// The result view reports the detected fields and shares them with the panel.
function GpuResult ({ result }) {
  const { t } = useTranslation()
  const setResult = useGpuLessonStore((state) => state.setResult)
  useEffect(() => { setResult(result); return () => setResult(null) }, [result, setResult])
  return <div className='w-full max-w-lg space-y-4'><p className='text-sm font-semibold text-indigo-700'>{t('gpuUI.complete')}</p><dl className='grid grid-cols-2 gap-3'>{[['tier', result.tier], ['type', result.type], ['gpu', result.gpu], ['fps', result.fps], ['device', result.device], ['mobile', result.isMobile == null ? null : String(result.isMobile)]].map(([key, value]) => <div key={key} className='rounded-xl border border-indigo-100 bg-white p-4'><dt className='text-xs text-slate-500'>{t(`gpuUI.${key}`)}</dt><dd className='mt-2 break-words font-mono text-sm text-slate-800'>{value ?? '—'}</dd></div>)}</dl></div>
}

// The hook version reads the GPU tier directly through useDetectGPU.
function HookResult () {
  const result = useDetectGPU(options)
  return <GpuResult result={result} />
}

// The component version receives the same result through its render callback.
function ComponentResult () {
  return <DetectGPU {...options}>{(result) => <GpuResult result={result} />}</DetectGPU>
}

// The demo provides loading and failure states for the asynchronous detection.
export default function DetectGpuDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useGpuLessonStore((state) => state.reset)
  useEffect(() => () => reset(), [name, reset])
  return <div role='group' aria-label={t('gpuUI.scene')} className='flex h-[55vh] min-h-80 items-center justify-center overflow-auto rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6'><GpuBoundary key={name} message={t('gpuUI.error')}><Suspense fallback={<p role='status' className='text-sm text-slate-600'>{t('gpuUI.loading')}</p>}>{name === 'DetectGPU' ? <ComponentResult /> : <HookResult />}</Suspense></GpuBoundary></div>
}

// The panel explains that the reported tier is an estimate rather than a live benchmark.
export function DetectGpuPanel () {
  const { t } = useTranslation()
  const result = useGpuLessonStore((state) => state.result)
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('gpuUI.panel')}</h3><p role='status' className='text-xs leading-6 text-slate-600'>{result ? t('gpuUI.ready') : t('gpuUI.pending')}</p><p className='text-xs leading-6 text-slate-500'>{t('gpuUI.hint')}</p></section>
}
