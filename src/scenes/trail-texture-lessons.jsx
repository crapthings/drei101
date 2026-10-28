import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { TrailTexture, useTrailTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the radius, lifetime and brightness of pointer traces.
export const useTraceStore = create((set) => ({ radius: 0.14, maxAge: 1500, intensity: 0.8, setValue: (key, value) => set({ [key]: value }), reset: () => set({ radius: 0.14, maxAge: 1500, intensity: 0.8 }) }))

// The surface paints pointer UV coordinates into the generated trail texture.
function TraceSurface ({ texture, onMove }) {
  return <mesh onPointerMove={onMove}><planeGeometry args={[5, 5]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
}

// The hook variant returns the texture and pointer handler as a tuple.
function HookTrace () {
  const { radius, maxAge, intensity } = useTraceStore()
  const [texture, onMove] = useTrailTexture({ radius, maxAge, intensity, interpolate: 4 })
  return <TraceSurface texture={texture} onMove={onMove} />
}

// The component variant exposes the same tuple through a render function.
function TraceScene () {
  const { name } = useParams()
  const { radius, maxAge, intensity } = useTraceStore()
  return <><color attach='background' args={['#e0e7ff']} /><ResponsiveFraming halfWidth={2.7} minimumDistance={8} />{name === 'TrailTexture' ? <TrailTexture radius={radius} maxAge={maxAge} intensity={intensity} interpolate={4}>{([texture, onMove]) => <TraceSurface texture={texture} onMove={onMove} />}</TrailTexture> : <HookTrace />}</>
}

// The canvas resets trace settings when entering and leaving a lesson.
export default function TraceDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useTraceStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('traceUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><TraceScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('traceUI.hint')}</span></div>
}

// The panel controls how large, bright and persistent the pointer trace appears.
export function TracePanel () {
  const { t } = useTranslation()
  const state = useTraceStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('traceUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['radius', 0.05, 0.4, 0.01], ['maxAge', 300, 4000, 100], ['intensity', 0.1, 1, 0.05]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`traceUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'maxAge' ? ' ms' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}</section>
}
