import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Wireframe } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the shader wireframe and its dash pattern.
export const useWireframeStore = create((set) => ({ enabled: true, dash: false, thickness: 0.08, repeats: 4, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, dash: false, thickness: 0.08, repeats: 4 }) }))

// The scene contrasts a plain mesh and the same geometry with a shader wireframe.
function WireframeScene () {
  const { enabled, dash, thickness, repeats } = useWireframeStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.8} minimumDistance={9} frontDepth={1.3} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-3, 2, 4]} intensity={0.8} /><mesh position={[-1.7, 0, 0]} rotation={[0.3, 0.45, 0]}><icosahedronGeometry args={[1.2, 1]} /><meshStandardMaterial color='#818cf8' roughness={0.5} /></mesh><mesh key={String(enabled)} position={[1.7, 0, 0]} rotation={[0.3, 0.45, 0]}><icosahedronGeometry args={[1.2, 1]} /><meshStandardMaterial color='#818cf8' roughness={0.5} />{enabled && <Wireframe stroke='#fbbf24' thickness={thickness} dash={dash} dashRepeats={repeats} fillOpacity={0} />}</mesh></>
}

// The canvas resets wireframe settings each time the lesson is entered.
export default function WireframeDemo () {
  const { t } = useTranslation()
  const reset = useWireframeStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('wireframeUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}><WireframeScene /></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('wireframeUI.reference')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('wireframeUI.effect')}</span></div></div>
}

// The panel toggles the overlay and adjusts line thickness and dashes.
export function WireframePanel () {
  const { t } = useTranslation()
  const state = useWireframeStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('wireframeUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['thickness', 0.01, 0.3, 0.01], ['repeats', 1, 12, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`wireframeUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{['enabled', 'dash'].map((key) => <Button key={key} aria-pressed={state[key]} onClick={() => state.setValue(key, !state[key])} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(`wireframeUI.${key}${state[key] ? 'On' : 'Off'}`)}</Button>)}</section>
}
