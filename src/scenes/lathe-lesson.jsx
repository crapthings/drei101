import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Lathe, Line } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { DoubleSide, Vector2 } from 'three'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares profile radius, angular sweep, subdivisions and wireframe state.
export const useLatheStore = create((set) => ({ waist: 1.1, segments: 32, sweep: 360, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ waist: 1.1, segments: 32, sweep: 360, wireframe: false }) }))

// The scene revolves a four-point profile around the Y axis.
function LatheScene () {
  const { waist, segments, sweep, wireframe } = useLatheStore()
  const points = useMemo(() => [new Vector2(0.5, -1.3), new Vector2(waist, -0.5), new Vector2(0.7, 0.5), new Vector2(0.45, 1.3)], [waist])
  const guide = useMemo(() => points.map((point) => [0, point.y, point.x + 0.02]), [points])
  return <><ResponsiveFraming halfWidth={2.2} minimumDistance={7} frontDepth={1.5} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><group rotation={[0, Math.PI / 2, 0]}><Lathe args={[points, segments, 0, sweep * Math.PI / 180]}><meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} side={DoubleSide} /></Lathe><Line points={guide} color='#f59e0b' lineWidth={3} /></group></>
}

// The canvas resets the profile and sweep when entering or leaving the lesson.
export default function LatheDemo () {
  const { t } = useTranslation()
  const reset = useLatheStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('latheUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><LatheScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('latheUI.legend')}</span></div>
}

// The panel adjusts one profile point, angular resolution and rotation range.
export function LathePanel () {
  const { t } = useTranslation()
  const state = useLatheStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('latheUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['waist', 0.3, 1.5, 0.1], ['segments', 3, 64, 1], ['sweep', 30, 360, 5]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`latheUI.${key}`)}</span><span className='font-mono'>{key === 'waist' ? `${state[key].toFixed(1)} m` : `${state[key]}${key === 'sweep' ? '°' : ''}`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('latheUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('latheUI.hint')}</p></section>
}
