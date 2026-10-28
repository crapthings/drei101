import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Edges, MeshDistortMaterial, MeshWobbleMaterial, Outlines } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares surface effect controls between the scene and its panel.
export const useSurfaceBasicsStore = create((set) => ({ enabled: true, amount: 0.4, speed: 1, thickness: 0.08, threshold: 15, width: 2, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, amount: 0.4, speed: 1, thickness: 0.08, threshold: 15, width: 2 }) }))

// The scene contrasts an untreated reference with the selected surface effect.
function SurfaceScene () {
  const { name } = useParams()
  const { enabled, amount, speed, thickness, threshold, width } = useSurfaceBasicsStore()
  const motion = name === 'MeshDistortMaterial' || name === 'MeshWobbleMaterial'
  const Material = name === 'MeshDistortMaterial' ? MeshDistortMaterial : MeshWobbleMaterial
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.7} minimumDistance={9} frontDepth={1} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 1, 4]} intensity={0.8} /><mesh position={[-1.8, 0, 0]} rotation={[0.3, 0.45, 0]}>{name === 'MeshWobbleMaterial' ? <boxGeometry args={[1.6, 1.6, 1.6, 24, 24, 24]} /> : motion ? <sphereGeometry args={[1, 64, 48]} /> : <icosahedronGeometry args={[1.1, 1]} />}<meshLambertMaterial color='#a5b4fc' /></mesh><mesh position={[1.8, 0, 0]} rotation={[0.3, 0.45, 0]}>{name === 'MeshWobbleMaterial' ? <boxGeometry args={[1.6, 1.6, 1.6, 24, 24, 24]} /> : motion ? <sphereGeometry args={[1, 64, 48]} /> : <icosahedronGeometry args={[1.1, 1]} />}{motion && enabled ? name === 'MeshDistortMaterial' ? <Material color='#6366f1' distort={amount} speed={speed} roughness={0.45} /> : <Material color='#6366f1' factor={amount} speed={speed} roughness={0.45} /> : <meshLambertMaterial color='#6366f1' />}{name === 'Edges' && enabled && <Edges threshold={threshold} lineWidth={width} color='#312e81' />}{name === 'Outlines' && enabled && <Outlines screenspace thickness={thickness} color='#312e81' />}</mesh></>
}

// The canvas resets settings on entering or leaving a surface lesson.
export default function SurfaceBasicsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useSurfaceBasicsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('surfaceBasicsUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}><SurfaceScene /></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between gap-2 text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('surfaceBasicsUI.reference')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('surfaceBasicsUI.effect')}</span></div></div>
}

// The panel adjusts the parameters relevant to the selected effect.
export function SurfaceBasicsPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useSurfaceBasicsStore()
  const fields = name === 'Edges' ? [['threshold', 0, 80, 1], ['width', 1, 8, 1]] : name === 'Outlines' ? [['thickness', 0.01, 0.3, 0.01]] : [['amount', 0, name === 'MeshDistortMaterial' ? 0.8 : 2, 0.05], ['speed', 0, 4, 0.1]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('surfaceBasicsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`surfaceBasicsUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'surfaceBasicsUI.on' : 'surfaceBasicsUI.off')}</Button></section>
}
