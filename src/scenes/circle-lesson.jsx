import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Circle } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares radius, angular range, subdivisions and wireframe visibility.
export const useCircleStore = create((set) => ({ radius: 1.8, segments: 32, start: 0, sweep: 270, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ radius: 1.8, segments: 32, start: 0, sweep: 270, wireframe: false }) }))

// The scene renders a circle sector in the XY plane facing the camera.
function CircleScene () {
  const { radius, segments, start, sweep, wireframe } = useCircleStore()
  return <><ResponsiveFraming halfWidth={2.2} minimumDistance={6} /><color attach='background' args={['#eef2ff']} /><Circle args={[radius, segments, start * Math.PI / 180, sweep * Math.PI / 180]}><meshBasicMaterial color='#6366f1' wireframe={wireframe} /></Circle></>
}

// The canvas resets circle settings when the lesson is entered or left.
export default function CircleDemo () {
  const { t } = useTranslation()
  const reset = useCircleStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('circleUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><CircleScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('circleUI.legend')}</span></div>
}

// The panel adjusts sector dimensions and visualizes the triangle fan.
export function CirclePanel () {
  const { t } = useTranslation()
  const state = useCircleStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('circleUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['radius', 0.5, 2, 0.1], ['segments', 3, 64, 1], ['start', 0, 360, 5], ['sweep', 15, 360, 5]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`circleUI.${key}`)}</span><span className='font-mono'>{key === 'radius' ? `${state[key].toFixed(1)} m` : `${state[key]}${key === 'segments' ? '' : '°'}`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('circleUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('circleUI.hint')}</p></section>
}
