import { Component, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { MatcapTexture, OrbitControls, useMatcapTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares the selected catalog entry and the loaded asset metadata.
export const useMatcapStore = create((set) => ({ id: 0, url: '', count: 0, setId: (id) => set({ id, url: '', count: 0 }), report: (url, count) => set({ url, count }), reset: () => set({ id: 0, url: '', count: 0 }) }))

// The boundary replaces a failed external request with a readable error state.
class MatcapErrorBoundary extends Component {
  constructor (props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError () { return { failed: true } }
  render () { return this.state.failed ? <div role='alert' className='flex h-full items-center justify-center bg-indigo-50 p-8 text-center text-sm text-slate-600'>{this.props.message}</div> : this.props.children }
}

// The sphere records metadata returned by either the hook or render-prop component.
function MatcapSphere ({ data }) {
  const [texture, url, count] = data
  const report = useMatcapStore((state) => state.report)
  useEffect(() => { report(url, count) }, [url, count, report])
  return <mesh><torusKnotGeometry args={[1, 0.35, 128, 32]} /><meshMatcapMaterial matcap={texture} /></mesh>
}

// The hook example loads the selected catalog entry directly.
function HookSphere ({ id }) {
  const data = useMatcapTexture(id, 256)
  return <MatcapSphere data={data} />
}

// The canvas uses the matching export and resets the experiment on navigation.
export default function MatcapDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { id, reset } = useMatcapStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('matcapUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><MatcapErrorBoundary key={`${name}-${id}`} message={t('matcapUI.error')}><Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><Suspense fallback={null}>{name === 'MatcapTexture' ? <MatcapTexture id={id} format={256}>{(data) => <MatcapSphere data={data} />}</MatcapTexture> : <HookSphere id={id} />}</Suspense><OrbitControls makeDefault minDistance={4} maxDistance={12} /></Canvas></MatcapErrorBoundary></div>
}

// The panel switches catalog entries and displays the actual returned URL and count.
export function MatcapPanel () {
  const { t } = useTranslation()
  const { id, url, count, setId } = useMatcapStore()
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('matcapUI.panel')}</h3><p className='text-xs text-slate-600'>{t('matcapUI.choose')}</p><div className='grid grid-cols-3 gap-2'>{[0, 1, 2].map((value) => <Button key={value} aria-pressed={id === value} onClick={() => setId(value)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${id === value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{value}</Button>)}</div><div aria-live='polite' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800'><p>{t('matcapUI.count')}: {count || '—'}</p><p className='break-all'>{t('matcapUI.url')}: {url || '—'}</p></div><p className='text-xs leading-6 text-slate-500'>{t('matcapUI.hint')}</p></section>
}
