import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Instance, Instances, PositionMesh } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the comparison mode and reports the selected instance and draw calls.
export const useInstancesStore = create((set) => ({ count: 50, instanced: true, selected: -1, calls: 0, isPositionMesh: false, setValue: (key, value) => set({ [key]: value }), reportCalls: (calls) => set((state) => state.calls === calls ? state : { calls }), reset: () => set({ count: 50, instanced: true, selected: -1, calls: 0, isPositionMesh: false }) }))

// The deterministic grid makes equivalent objects comparable in both render modes.
function instancePosition (index) {
  return [(index % 10 - 4.5) * 0.52, (Math.floor(index / 10) - 4.5) * 0.52, 0]
}

// The instance exposes its actual PositionMesh and supports per-instance selection.
function GridInstance ({ index }) {
  const ref = useRef(null)
  const { selected, setValue } = useInstancesStore()
  useEffect(() => { if (index === 0) setValue('isPositionMesh', ref.current instanceof PositionMesh) }, [index, setValue])
  return <Instance ref={ref} position={instancePosition(index)} color={selected === index ? '#f59e0b' : '#6366f1'} onClick={(event) => { event.stopPropagation(); setValue('selected', index) }} />
}

// The scene can switch between one instanced mesh and individually drawn meshes.
function InstanceScene () {
  const { count, instanced, selected, setValue } = useInstancesStore()
  return <>{instanced ? <Instances limit={100} range={count}><boxGeometry args={[0.35, 0.35, 0.35]} /><meshStandardMaterial />{Array.from({ length: count }, (_, index) => <GridInstance key={index} index={index} />)}</Instances> : Array.from({ length: count }, (_, index) => <mesh key={index} position={instancePosition(index)} onClick={(event) => { event.stopPropagation(); setValue('selected', index) }}><boxGeometry args={[0.35, 0.35, 0.35]} /><meshStandardMaterial color={selected === index ? '#f59e0b' : '#6366f1'} /></mesh>)}</>
}

// The reporter samples the renderer's completed-frame draw calls.
function DrawCallReporter () {
  const last = useRef(0)
  const reportCalls = useInstancesStore((state) => state.reportCalls)
  useFrame(({ gl, clock }) => { if (clock.elapsedTime - last.current > 0.5) { last.current = clock.elapsedTime; reportCalls(gl.info.render.calls) } }, -1)
  return null
}

// The canvas displays equivalent grids for the instanced and ordinary mesh paths.
export default function InstancesDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useInstancesStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('instancesUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3} minimumDistance={8} frontDepth={0} /><directionalLight position={[3, 5, 5]} intensity={3} /><DrawCallReporter /><InstanceScene /></Canvas></div>
}

// The panel compares rendering modes and reports the selected instance.
export function InstancesPanel () {
  const { t } = useTranslation()
  const state = useInstancesStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('instancesUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><Button aria-pressed={state.instanced} onClick={() => { state.setValue('instanced', !state.instanced); state.setValue('selected', -1) }} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.instanced ? 'instancesUI.batched' : 'instancesUI.separate')}</Button><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('instancesUI.count')}</span><span className='font-mono'>{state.count}</span></span><input type='range' min='10' max='100' step='10' value={state.count} onChange={(event) => { state.setValue('count', Number(event.target.value)); state.setValue('selected', -1) }} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('instancesUI.calls')}: <span className='font-mono'>{state.calls}</span></p><p role='status' className='text-xs text-slate-600'>{t('instancesUI.selected')}: {state.selected < 0 ? '—' : state.selected + 1}</p>{state.instanced && <p className='text-xs text-slate-600'>ref instanceof PositionMesh: <span className='font-mono'>{String(state.isPositionMesh)}</span></p>}<p className='text-xs leading-6 text-slate-500'>{t('instancesUI.hint')}</p></section>
}
