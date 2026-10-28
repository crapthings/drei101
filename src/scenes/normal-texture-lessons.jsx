import { Component, Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { NormalTexture, OrbitControls, useNormalTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares the catalog entry, repeat, strength and returned metadata.
export const useNormalLessonStore = create((set) => ({ id: 0, repeat: 2, strength: 1, url: '', count: 0, setValue: (key, value) => set({ [key]: value, ...(key === 'id' ? { url: '', count: 0 } : {}) }), report: (url, count) => set({ url, count }), reset: () => set({ id: 0, repeat: 2, strength: 1, url: '', count: 0 }) }))

// The boundary displays external catalog and image loading failures.
class NormalErrorBoundary extends Component {
  constructor (props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError () { return { failed: true } }
  render () { return this.state.failed ? <div role='alert' className='flex h-full items-center justify-center bg-indigo-50 p-8 text-center text-sm text-slate-600'>{this.props.message}</div> : this.props.children }
}

// The surface applies the returned normal map with the project's hex tiling material.
function NormalSurface ({ data }) {
  const [texture, url, count] = data
  const { strength, report } = useNormalLessonStore()
  const materialArgs = useMemo(() => [{ hexTiling: { patchScale: 2 } }], [])
  useEffect(() => { report(url, count) }, [url, count, report])
  return <mesh rotation={[-0.3, -0.35, 0]}><planeGeometry args={[4, 4]} /><meshStandardMaterial args={materialArgs} color='#c7d2fe' roughness={0.7} normalMap={texture} normalScale={[strength, strength]} /></mesh>
}

// The hook example loads a catalog entry with the requested repeat.
function HookSurface ({ id, repeat }) {
  const settings = useMemo(() => ({ repeat: [repeat, repeat] }), [repeat])
  const data = useNormalTexture(id, settings)
  return <NormalSurface data={data} />
}

// The canvas selects the actual hook or render-prop wrapper and handles failure.
export default function NormalTextureDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { id, repeat, reset } = useNormalLessonStore()
  const repeatValue = useMemo(() => [repeat, repeat], [repeat])
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('normalTextureUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><NormalErrorBoundary key={`${name}-${id}`} message={t('normalTextureUI.error')}><Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 2, 3]} intensity={3} /><directionalLight position={[-3, -2, 2]} intensity={0.6} /><Suspense fallback={null}>{name === 'NormalTexture' ? <NormalTexture id={id} repeat={repeatValue}>{(data) => <NormalSurface data={data} />}</NormalTexture> : <HookSurface id={id} repeat={repeat} />}</Suspense><OrbitControls makeDefault minDistance={4} maxDistance={12} /></Canvas></NormalErrorBoundary></div>
}

// The panel changes the loaded entry and material response.
export function NormalTexturePanel () {
  const { t } = useTranslation()
  const state = useNormalLessonStore()
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('normalTextureUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><p className='text-xs text-slate-600'>{t('normalTextureUI.id')}</p><div className='grid grid-cols-3 gap-2'>{[0, 1, 2].map((id) => <Button key={id} aria-pressed={state.id === id} onClick={() => state.setValue('id', id)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${state.id === id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{id}</Button>)}</div>{[['repeat', 1, 5, 0.5], ['strength', 0, 2, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-2 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`normalTextureUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2' /></label>)}<div aria-live='polite' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800'><p>{t('normalTextureUI.count')}: {state.count || '—'}</p><p className='break-all'>{t('normalTextureUI.url')}: {state.url || '—'}</p></div><p className='text-xs leading-6 text-slate-500'>{t('normalTextureUI.hint')}</p></section>
}
