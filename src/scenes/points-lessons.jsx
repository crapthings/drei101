import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Point, Points, PointsBuffer, PositionPoint } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares point count, size and the observed draw calls and selection.
export const usePointsStore = create((set) => ({ count: 100, size: 0.12, selected: -1, calls: 0, isPositionPoint: false, setValue: (key, value) => set({ [key]: value }), reportCalls: (calls) => set((state) => state.calls === calls ? state : { calls }), reset: () => set({ count: 100, size: 0.12, selected: -1, calls: 0, isPositionPoint: false }) }))

// The deterministic grid positions keep changes in point count easy to compare.
function pointPosition (index) {
  return [(index % 20 - 9.5) * 0.25, (Math.floor(index / 20) - 4.5) * 0.25, 0]
}

// Each declarative point is backed by a PositionPoint and can receive pointer events.
function InteractivePoint ({ index }) {
  const ref = useRef(null)
  const setValue = usePointsStore((state) => state.setValue)
  useEffect(() => { if (index === 0) setValue('isPositionPoint', ref.current instanceof PositionPoint) }, [index, setValue])
  return <Point ref={ref} position={pointPosition(index)} onClick={(event) => { event.stopPropagation(); setValue('selected', index) }} />
}

// The buffer path passes a Float32Array directly to PointsBuffer.
function BufferCloud () {
  const { count, size } = usePointsStore()
  const positions = useMemo(() => Float32Array.from(Array.from({ length: count }, (_, index) => pointPosition(index)).flat()), [count])
  return <PointsBuffer key={count} positions={positions}><pointsMaterial size={size} color='#4f46e5' sizeAttenuation /></PointsBuffer>
}

// The declarative path uses Points and individual Point children.
function DeclarativeCloud () {
  const { count, size } = usePointsStore()
  return <Points limit={200} range={count}><pointsMaterial size={size} color='#4f46e5' sizeAttenuation />{Array.from({ length: count }, (_, index) => <InteractivePoint key={index} index={index} />)}</Points>
}

// The reporter reads the renderer's completed-frame draw call count at a modest interval.
function DrawCallReporter () {
  const last = useRef(0)
  const reportCalls = usePointsStore((state) => state.reportCalls)
  useFrame(({ gl, clock }) => { if (clock.elapsedTime - last.current > 0.5) { last.current = clock.elapsedTime; reportCalls(gl.info.render.calls) } }, -1)
  return null
}

// The canvas selects the actual declarative or buffer API for the active lesson.
export default function PointsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = usePointsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('pointsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} raycaster={{ params: { Points: { threshold: 0.09 } } }}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3} minimumDistance={6} frontDepth={0} /><DrawCallReporter />{name === 'PointsBuffer' ? <BufferCloud /> : <DeclarativeCloud />}</Canvas></div>
}

// The panel adjusts point count and size and reports the actual renderer statistics.
export function PointsPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = usePointsStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('pointsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['count', 20, 200, 20], ['size', 0.05, 0.3, 0.01]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`pointsUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => { const value = Number(event.target.value); state.setValue(key, value); if (key === 'count' && state.selected >= value) state.setValue('selected', -1) }} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('pointsUI.calls')}: <span className='font-mono'>{state.calls}</span></p>{name !== 'PointsBuffer' && <><p role='status' className='text-xs text-slate-600'>{t('pointsUI.selected')}: {state.selected < 0 ? '—' : state.selected + 1}</p><p className='text-xs text-slate-600'>ref instanceof PositionPoint: <span className='font-mono'>{String(state.isPositionPoint)}</span></p><p className='text-xs leading-6 text-slate-500'>{t('pointsUI.hint')}</p></>}</section>
}
