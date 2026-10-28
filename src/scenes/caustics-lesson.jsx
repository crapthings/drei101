import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Caustics, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls the refractive projection and its virtual light position.
export const useCausticsStore = create((set) => ({ ior: 1.2, intensity: 0.05, radius: 0.08, lightX: 2, height: 1.8, setValue: (key, value) => set({ [key]: value }), reset: () => set({ ior: 1.2, intensity: 0.05, radius: 0.08, lightX: 2, height: 1.8 }) }))

// The scene projects refracted light through a sphere onto a dark receiver.
function CausticsScene () {
  const { ior, intensity, radius, lightX, height } = useCausticsStore()
  return <><color attach='background' args={['#1e1b4b']} /><directionalLight position={[3, 5, 4]} intensity={3} /><directionalLight position={[-3, 2, -3]} intensity={0.5} /><mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='#334155' roughness={0.8} /></mesh><Caustics key={`${ior}-${intensity}-${radius}-${lightX}-${height}`} frames={1} resolution={512} ior={ior} intensity={intensity} worldRadius={radius} lightSource={[lightX, 5, 3]} color='#c7d2fe'><mesh position={[0, height, 0]}><sphereGeometry args={[0.8, 48, 32]} /><meshPhysicalMaterial color='#a5b4fc' roughness={0.12} metalness={0.1} transparent opacity={0.6} /></mesh></Caustics><OrbitControls makeDefault target={[0, 1, 0]} minDistance={4} maxDistance={14} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The canvas resets the projection parameters when entering or leaving the lesson.
export default function CausticsDemo () {
  const { t } = useTranslation()
  const reset = useCausticsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('causticsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [5, 4, 8], fov: 45 }} dpr={[1, 2]}><CausticsScene /></Canvas></div>
}

// The panel adjusts refraction, projection strength and the virtual light direction.
export function CausticsPanel () {
  const { t } = useTranslation()
  const state = useCausticsStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('causticsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['ior', 0.8, 1.6, 0.05], ['intensity', 0, 0.3, 0.01], ['radius', 0.02, 0.3, 0.01], ['lightX', -4, 4, 0.5], ['height', 0.9, 3, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`causticsUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('shadowBasicsUI.orbitHint')}</p></section>
}
