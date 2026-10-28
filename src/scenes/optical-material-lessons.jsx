import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { MeshReflectorMaterial, MeshTransmissionMaterial, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls reflection and transmission settings for the two optical lessons.
export const useOpticalStore = create((set) => ({ enabled: true, strength: 1, blur: 0.3, ior: 1.5, thickness: 1, roughness: 0.1, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, strength: 1, blur: 0.3, ior: 1.5, thickness: 1, roughness: 0.1 }) }))

// The reflection scene renders colored objects above a planar reflective floor.
function ReflectorScene () {
  const { enabled, strength, blur } = useOpticalStore()
  return <><color attach='background' args={['#e0e7ff']} /><directionalLight position={[3, 6, 5]} intensity={3} /><directionalLight position={[-4, 3, -2]} intensity={1} /><mesh position={[-1.2, 1, 0]}><boxGeometry args={[1.2, 2, 1.2]} /><meshStandardMaterial color='#6366f1' roughness={0.4} /></mesh><mesh position={[1.2, 0.8, -0.4]}><sphereGeometry args={[0.8, 48, 32]} /><meshStandardMaterial color='#fbbf24' roughness={0.35} /></mesh><mesh rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} />{enabled ? <MeshReflectorMaterial resolution={512} blur={[300, 300]} mixBlur={blur} mixStrength={strength} color='#a5b4fc' metalness={0.25} roughness={0.4} /> : <meshStandardMaterial color='#a5b4fc' metalness={0.25} roughness={0.4} />}</mesh><OrbitControls makeDefault target={[0, 0.8, 0]} minDistance={5} maxDistance={18} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The transmission scene places a refractive sphere in front of colored geometry.
function TransmissionScene () {
  const { enabled, ior, thickness, roughness } = useOpticalStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.6} minimumDistance={8} frontDepth={1.3} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, 4]} intensity={1} /><mesh position={[0, 0, -2]}><planeGeometry args={[6.5, 4.5]} /><meshBasicMaterial color='#c7d2fe' /></mesh>{[-2, -1, 0, 1, 2].map((x, index) => <mesh key={x} position={[x, 0, -1.9]}><planeGeometry args={[0.55, 3.8]} /><meshBasicMaterial color={index % 2 ? '#4f46e5' : '#fbbf24'} /></mesh>)}<mesh><sphereGeometry args={[1.3, 64, 48]} />{enabled ? <MeshTransmissionMaterial transmission={1} ior={ior} thickness={thickness} roughness={roughness} chromaticAberration={0.03} samples={6} resolution={512} /> : <meshStandardMaterial color='#818cf8' roughness={0.35} />}</mesh></>
}

// The canvas chooses the reflective floor or the transmissive sphere demonstration.
export default function OpticalDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useOpticalStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('opticalUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: name === 'MeshReflectorMaterial' ? [5, 4, 8] : [0, 0, 8], fov: 45 }} dpr={[1, 2]}>{name === 'MeshReflectorMaterial' ? <ReflectorScene /> : <TransmissionScene />}</Canvas></div>
}

// The panel adjusts parameters specific to reflection or transmission.
export function OpticalPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useOpticalStore()
  const fields = name === 'MeshReflectorMaterial' ? [['strength', 0, 2, 0.1], ['blur', 0, 1, 0.05]] : [['ior', 1, 2, 0.05], ['thickness', 0, 3, 0.1], ['roughness', 0, 0.8, 0.05]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('opticalUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`opticalUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'opticalUI.on' : 'opticalUI.off')}</Button>{name === 'MeshReflectorMaterial' && <p className='text-xs leading-6 text-slate-500'>{t('opticalUI.orbit')}</p>}</section>
}
