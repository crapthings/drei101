import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares plane dimensions, subdivision counts and wireframe visibility.
export const usePlaneStore = create((set) => ({ width: 3, height: 2, widthSegments: 1, heightSegments: 1, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ width: 3, height: 2, widthSegments: 1, heightSegments: 1, wireframe: false }) }))

// The scene displays a plane with independently adjustable width and height subdivisions.
function PlaneScene () {
  const { width, height, widthSegments, heightSegments, wireframe } = usePlaneStore()
  return <><ResponsiveFraming halfWidth={2.2} minimumDistance={6} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Plane args={[width, height, widthSegments, heightSegments]}><meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} /></Plane></>
}

// The canvas resets plane settings when the lesson is entered or left.
export default function PlaneDemo () {
  const { t } = useTranslation()
  const reset = usePlaneStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('planeUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><PlaneScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('planeUI.legend')}</span></div>
}

// The panel adjusts plane dimensions and compares surface subdivisions.
export function PlanePanel () {
  const { t } = useTranslation()
  const state = usePlaneStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('planeUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['width', 0.5, 3, 0.1], ['height', 0.5, 3, 0.1], ['widthSegments', 1, 12, 1], ['heightSegments', 1, 12, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`planeUI.${key}`)}</span><span className='font-mono'>{key === 'width' || key === 'height' ? `${state[key].toFixed(1)} m` : state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('planeUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900'>{t('planeUI.triangles', { count: 2 * state.widthSegments * state.heightSegments })}</p></section>
}
