import { useContext, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight, accumulativeContext, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares the caster, light distribution and accumulation progress.
export const useAccumulationStore = create((set) => ({ x: 0, radius: 3, amount: 4, frames: 60, progress: 0, revision: 0, setValue: (key, value) => set({ [key]: value }), setProgress: (progress) => set((state) => state.progress === progress ? state : { progress }), restart: () => set((state) => ({ revision: state.revision + 1, progress: 0 })), reset: () => set({ x: 0, radius: 3, amount: 4, frames: 60, progress: 0, revision: 0 }) }))

// The context consumer restarts and reports the actual progressive accumulator.
function AccumulationObserver () {
  const api = useContext(accumulativeContext)
  const x = useAccumulationStore((state) => state.x)
  const radius = useAccumulationStore((state) => state.radius)
  const amount = useAccumulationStore((state) => state.amount)
  const frames = useAccumulationStore((state) => state.frames)
  const revision = useAccumulationStore((state) => state.revision)
  const setProgress = useAccumulationStore((state) => state.setProgress)
  useEffect(() => { api.reset(); setProgress(0) }, [api, x, radius, amount, frames, revision, setProgress])
  useFrame(() => { const next = Math.min(api.count, api.frames); if (next % 5 === 0 || next === api.frames) setProgress(next) })
  return null
}

// The scene combines a movable caster with a progressively sampled light field.
function AccumulationScene () {
  const x = useAccumulationStore((state) => state.x)
  const radius = useAccumulationStore((state) => state.radius)
  const amount = useAccumulationStore((state) => state.amount)
  const frames = useAccumulationStore((state) => state.frames)
  return <><color attach='background' args={['#e0e7ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><directionalLight position={[-4, 3, -2]} intensity={0.8} /><mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='#f8fafc' /></mesh><mesh castShadow position={[x, 1, 0]}><boxGeometry args={[1.2, 2, 1.2]} /><meshStandardMaterial color='#6366f1' roughness={0.5} /></mesh><AccumulativeShadows temporal frames={frames} alphaTest={0.9} opacity={1} scale={7} resolution={512}><RandomizedLight amount={amount} radius={radius} position={[3, 6, 4]} ambient={0} intensity={2} size={5} mapSize={512} /><AccumulationObserver /></AccumulativeShadows><OrbitControls makeDefault target={[0, 0.8, 0]} minDistance={5} maxDistance={16} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The canvas enables shadow maps and resets each accumulator lesson on navigation.
export default function AccumulationDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useAccumulationStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('accumulationUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas shadows camera={{ position: [5, 4, 8], fov: 45 }} dpr={[1, 2]}><AccumulationScene /></Canvas></div>
}

// The panel lets readers move the caster, adjust light sampling and restart accumulation.
export function AccumulationPanel () {
  const { t } = useTranslation()
  const state = useAccumulationStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('accumulationUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['x', -2, 2, 0.1], ['radius', 0, 6, 0.5], ['amount', 1, 8, 1], ['frames', 10, 100, 10]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`accumulationUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<div className='space-y-2 text-xs text-slate-600'><div className='flex justify-between'><span>{t('accumulationUI.progress')}</span><span className='font-mono'>{state.progress} / {state.frames}</span></div><progress className='h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-indigo-100 [&::-webkit-progress-value]:bg-indigo-600' max={state.frames} value={state.progress} aria-label={t('accumulationUI.progress')} /></div><Button onClick={state.restart} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t('accumulationUI.restart')}</Button><p className='text-xs leading-6 text-slate-500'>{t('shadowBasicsUI.orbitHint')}</p></section>
}
