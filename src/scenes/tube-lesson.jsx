import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, Tube } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { CubicBezierCurve3, Vector3 } from 'three'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares path bend, tube radius and the two geometry subdivision counts.
export const useTubeStore = create((set) => ({ bend: 2, radius: 0.25, tubular: 64, radial: 12, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ bend: 2, radius: 0.25, tubular: 64, radial: 12, wireframe: false }) }))

// The scene creates a tube along an open Bézier path and overlays its centerline.
function TubeScene () {
  const { bend, radius, tubular, radial, wireframe } = useTubeStore()
  const curve = useMemo(() => new CubicBezierCurve3(new Vector3(-3, -0.5, 0), new Vector3(-1.5, bend, 0), new Vector3(1.5, -bend, 0), new Vector3(3, 0.5, 0)), [bend])
  const points = useMemo(() => curve.getPoints(100), [curve])
  return <><ResponsiveFraming halfWidth={3.5} minimumDistance={8} frontDepth={0.5} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Tube args={[curve, tubular, radius, radial, false]}><meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} /></Tube><Line points={points} color='#f59e0b' lineWidth={2} depthTest={false} renderOrder={1} /></>
}

// The canvas resets the path and tube settings on entry and exit.
export default function TubeDemo () {
  const { t } = useTranslation()
  const reset = useTubeStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('tubeUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><TubeScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('tubeUI.legend')}</span></div>
}

// The panel controls path bend, radius, subdivisions and wireframe visibility.
export function TubePanel () {
  const { t } = useTranslation()
  const state = useTubeStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('tubeUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['bend', 0.5, 3, 0.1], ['radius', 0.1, 0.5, 0.05], ['tubular', 4, 128, 4], ['radial', 3, 24, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`tubeUI.${key}`)}</span><span className='font-mono'>{key === 'bend' || key === 'radius' ? `${state[key].toFixed(2)} m` : state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('tubeUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('tubeUI.hint')}</p></section>
}
