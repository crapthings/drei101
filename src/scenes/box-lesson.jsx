import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares box dimensions, subdivision count and wireframe visibility.
export const useBoxStore = create((set) => ({ width: 2, height: 1.5, depth: 1, segments: 1, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ width: 2, height: 1.5, depth: 1, segments: 1, wireframe: false }) }))

// The scene displays a box with equal subdivisions along each axis.
function BoxScene () {
  const { width, height, depth, segments, wireframe } = useBoxStore()
  return <><ResponsiveFraming halfWidth={2.5} minimumDistance={6} frontDepth={2} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Box args={[width, height, depth, segments, segments, segments]} rotation={[-0.25, 0.55, 0]}><meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} /></Box></>
}

// The canvas resets box settings when the lesson is entered or left.
export default function BoxDemo () {
  const { t } = useTranslation()
  const reset = useBoxStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('boxUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><BoxScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('boxUI.legend')}</span></div>
}

// The panel adjusts the three dimensions and compares surface subdivisions.
export function BoxPanel () {
  const { t } = useTranslation()
  const state = useBoxStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('boxUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['width', 0.5, 3, 0.1], ['height', 0.5, 3, 0.1], ['depth', 0.5, 3, 0.1], ['segments', 1, 8, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`boxUI.${key}`)}</span><span className='font-mono'>{key === 'segments' ? state[key] : `${state[key].toFixed(1)} m`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('boxUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900'>{t('boxUI.triangles', { count: 12 * state.segments ** 2 })}</p></section>
}
