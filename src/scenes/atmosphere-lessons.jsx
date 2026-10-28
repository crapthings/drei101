import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, Stars, Sparkles, calcPosFromAngles } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares sky angles and particle settings between the scene and its controls.
export const useAtmosphereStore = create((set) => ({ inclination: 0.55, azimuth: 0.25, turbidity: 8, count: 1200, size: 4, speed: 1, setValue: (key, value) => set({ [key]: value }), reset: () => set({ inclination: 0.55, azimuth: 0.25, turbidity: 8, count: 1200, size: 4, speed: 1 }) }))

// The scene renders a procedural sky, a distant star field or nearby glowing particles.
function AtmosphereScene () {
  const { name } = useParams()
  const { inclination, azimuth, turbidity, count, size, speed } = useAtmosphereStore()
  if (name === 'Sky' || name === 'calcPosFromAngles') return <><Sky distance={100} sunPosition={calcPosFromAngles(inclination, azimuth)} turbidity={turbidity} /><directionalLight position={[3, 5, 4]} intensity={3} /><mesh position={[0, -1.2, 0]}><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color='#4f46e5' roughness={0.5} /></mesh></>
  if (name === 'Stars') return <><color attach='background' args={['#080d24']} /><Stars radius={40} depth={25} count={count} factor={size} saturation={0.25} fade speed={speed} /></>
  return <><color attach='background' args={['#111636']} /><directionalLight position={[3, 4, 5]} intensity={2} /><mesh><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color='#4338ca' roughness={0.65} /></mesh><Sparkles key={count} count={Math.round(count / 10)} scale={[6, 4, 4]} size={size} speed={speed} color='#c7d2fe' /></>
}

// The canvas starts each sky or particle experiment with its default values.
export default function AtmosphereDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useAtmosphereStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('atmosphereUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 1, 8], fov: 50, far: 300 }} dpr={[1, 2]}><AtmosphereScene /></Canvas></div>
}

// The panel controls sun position and haze or particle count, size and speed.
export function AtmospherePanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useAtmosphereStore()
  const isSky = name === 'Sky' || name === 'calcPosFromAngles'
  const fields = isSky ? [['inclination', 0.5, 0.9, 0.01], ['azimuth', 0.05, 0.45, 0.01], ['turbidity', 1, 20, 1]] : [['count', name === 'Sparkles' ? 20 : 200, name === 'Sparkles' ? 300 : 3000, name === 'Sparkles' ? 10 : 100], ['size', 1, 10, 0.5], ['speed', 0, 3, 0.1]]
  const sun = calcPosFromAngles(state.inclination, state.azimuth)
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('atmosphereUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => { const divisor = key === 'count' && name === 'Sparkles' ? 10 : 1; return <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`atmosphereUI.${key}`)}</span><span className='font-mono'>{state[key] / divisor}</span></span><input type='range' min={min} max={max} step={step} value={state[key] / divisor} onChange={(event) => state.setValue(key, Number(event.target.value) * divisor)} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label> })}{isSky && <p className='rounded-lg bg-indigo-50 p-3 font-mono text-xs leading-6 text-indigo-900'>{t('atmosphereUI.sun')}: [{sun.toArray().map((n) => n.toFixed(2)).join(', ')}]</p>}<p className='text-xs leading-6 text-slate-500'>{t(isSky ? 'atmosphereUI.skyHint' : 'atmosphereUI.particleHint')}</p></section>
}
