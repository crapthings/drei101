import { useEffect, useRef } from 'react'
import { Loader, Progress, useProgress } from '@react-three/drei'
import { DefaultLoadingManager } from 'three'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares the experiment's current request batch with its controls.
export const useProgressLessonStore = create((set) => ({ batch: null, run: (failure) => set({ batch: { id: `${Date.now()}-${Math.random()}`, failure } }), reset: () => set({ batch: null }) }))

// The request uses real HTTP responses and reports each asset to Three's loading manager.
async function loadTrackedAsset (url, delay, signal) {
  DefaultLoadingManager.itemStart(url)
  try {
    const response = await fetch(url, { signal })
    if (!response.ok || (url.includes('missing-progress-demo-file.svg') && !(response.headers.get('content-type') || '').includes('image/svg+xml'))) throw new Error(`Invalid response: ${response.status}`)
    await response.arrayBuffer()
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, delay)
      signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')) }, { once: true })
      if (signal.aborted) { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')) }
    })
  } catch (error) {
    if (!signal.aborted) DefaultLoadingManager.itemError(url)
  } finally {
    DefaultLoadingManager.itemEnd(url)
  }
}

// The batch starts three real local requests and cancels them on navigation or replacement.
function AssetBatch () {
  const batch = useProgressLessonStore((state) => state.batch)
  useEffect(() => {
    if (!batch) return
    const controller = new AbortController()
    const paths = ['images/crop-demo.svg', 'models/robot.gltf', batch.failure ? 'missing-progress-demo-file.svg' : 'images/vector-demo.svg']
    paths.forEach((path, index) => { loadTrackedAsset(`${import.meta.env.BASE_URL}${path}?batch=${batch.id}`, 1800 + index * 1000, controller.signal) })
    return () => controller.abort()
  }, [batch])
  return null
}

// The display reads the actual shared loading state from either the hook or component.
function ProgressReadout ({ data }) {
  const { t } = useTranslation()
  const batch = useProgressLessonStore((state) => state.batch)
  const errors = batch ? data.errors.filter((url) => url.includes(`batch=${batch.id}`)) : []
  return <div aria-live='polite' className='w-full max-w-md space-y-3 rounded-xl bg-white p-5 text-left text-sm text-slate-700'><div className='flex justify-between'><span>{t('progressUI.status')}</span><strong>{t(data.active ? 'progressUI.active' : 'progressUI.idle')}</strong></div><progress className='h-2 w-full accent-indigo-600' max='100' value={Number.isFinite(data.progress) ? data.progress : 0} aria-label={t('progressUI.progress')} /><div className='flex justify-between font-mono text-xs'><span>{data.progress.toFixed(0)}%</span><span>{data.loaded} / {data.total}</span></div><p className='break-all text-xs'>{t('progressUI.item')}: {data.item || '—'}</p><p className='break-all text-xs'>{t('progressUI.errors')}: {errors.length ? errors.join(', ') : '—'}</p></div>
}

// The hook variant subscribes to the same store exposed by Progress.
function HookReadout () {
  const data = useProgress()
  return <ProgressReadout data={data} />
}

// The experiment mounts the matching progress API and a scoped Loader overlay.
export default function ProgressDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useProgressLessonStore((state) => state.reset)
  const resetRef = useRef(reset)
  useEffect(() => () => resetRef.current(), [])
  return <div role='group' aria-label={t('progressUI.scene')} className='relative flex min-h-80 items-center justify-center overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/70 p-8'><AssetBatch />{name === 'Progress' ? <Progress>{(data) => <ProgressReadout data={data} />}</Progress> : <HookReadout />}{name === 'Loader' && <Loader containerStyles={{ background: 'rgba(238, 242, 255, 0.96)' }} innerStyles={{ background: '#c7d2fe', width: 180 }} barStyles={{ background: '#4f46e5' }} dataStyles={{ color: '#3730a3' }} dataInterpolation={(value) => `${t('progressUI.loading')} ${value.toFixed(0)}%`} />}</div>
}

// The panel starts either a successful batch or a batch containing a missing asset.
export function ProgressPanel () {
  const { t } = useTranslation()
  const run = useProgressLessonStore((state) => state.run)
  const active = useProgress((state) => state.active)
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('progressUI.panel')}</h3><Button disabled={active} onClick={() => run(false)} className='w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2'>{t('progressUI.success')}</Button><Button disabled={active} onClick={() => run(true)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2'>{t('progressUI.fail')}</Button><p className='text-xs leading-6 text-slate-500'>{t('progressUI.hint')}</p></section>
}
