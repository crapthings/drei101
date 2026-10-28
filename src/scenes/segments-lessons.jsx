import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Segment, SegmentObject, Segments } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the segment count and width and reports actual rendering state.
export const useSegmentsStore = create((set) => ({ count: 24, width: 2, length: 1.5, calls: 0, isSegmentObject: false, setValue: (key, value) => set({ [key]: value }), reportCalls: (calls) => set((state) => state.calls === calls ? state : { calls }), reset: () => set({ count: 24, width: 2, length: 1.5, calls: 0, isSegmentObject: false }) }))

// The first segment exposes its real SegmentObject through a ref.
function RaySegment ({ index, count, length }) {
  const ref = useRef(null)
  const setValue = useSegmentsStore((state) => state.setValue)
  const angle = index * Math.PI * 2 / count
  useEffect(() => { if (index === 0) setValue('isSegmentObject', ref.current instanceof SegmentObject) }, [index, setValue])
  return <Segment ref={ref} start={[Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0]} end={[Math.cos(angle) * length, Math.sin(angle) * length, 0]} color={index % 2 ? '#f59e0b' : '#4f46e5'} />
}

// The reporter displays the renderer's draw calls from the completed frame.
function DrawCallReporter () {
  const last = useRef(0)
  const reportCalls = useSegmentsStore((state) => state.reportCalls)
  useFrame(({ gl, clock }) => { if (clock.elapsedTime - last.current > 0.5) { last.current = clock.elapsedTime; reportCalls(gl.info.render.calls) } }, -1)
  return null
}

// The canvas draws a radial set of independently configured segments in one batch.
export default function SegmentsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { count, width, length, reset } = useSegmentsStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('segmentsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.5} minimumDistance={6} frontDepth={0} /><DrawCallReporter /><Segments key={count} limit={count} lineWidth={width}>{Array.from({ length: count }, (_, index) => <RaySegment key={index} index={index} count={count} length={length} />)}</Segments></Canvas></div>
}

// The panel changes the batch and displays its renderer count and underlying object type.
export function SegmentsPanel () {
  const { t } = useTranslation()
  const state = useSegmentsStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('segmentsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['count', 4, 80, 4], ['width', 1, 8, 1], ['length', 0.5, 2.2, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`segmentsUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'length' ? ' m' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('segmentsUI.calls')}: <span className='font-mono'>{state.calls}</span></p><p className='text-xs text-slate-600'>ref instanceof SegmentObject: <span className='font-mono'>{String(state.isSegmentObject)}</span></p></section>
}
