import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, SpotLight, SpotLightShadow } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The stripe mask alternates opaque and transparent bands for the projected shadow.
const stripeShader = `varying vec2 vUv; void main() { float stripe = step(0.5, fract(vUv.x * 6.0)); gl_FragColor = vec4(vec3(stripe), 1.0); }`

// The store controls the cone, position and patterned shadow of the spotlight.
export const useSpotlightStore = create((set) => ({ lightX: 0, angle: 0.45, opacity: 0.35, distance: 0.35, mask: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ lightX: 0, angle: 0.45, opacity: 0.35, distance: 0.35, mask: true }) }))

// The scene projects a spotlight onto a floor and optionally inserts a patterned caster.
function SpotlightScene () {
  const { name } = useParams()
  const { lightX, angle, opacity, distance, mask } = useSpotlightStore()
  return <><color attach='background' args={['#1e1b4b']} /><directionalLight position={[-4, 3, 5]} intensity={0.25} /><SpotLight position={[lightX, 5, 1]} distance={8} angle={angle} attenuation={5} anglePower={5} opacity={opacity} intensity={90} penumbra={0.4} castShadow shadow-mapSize={[1024, 1024]}>{name === 'SpotLightShadow' && mask ? <SpotLightShadow distance={distance} scale={2.5} shader={stripeShader} /> : null}</SpotLight><mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='#c7d2fe' roughness={0.8} /></mesh><OrbitControls makeDefault target={[0, 1.5, 0]} minDistance={5} maxDistance={16} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The canvas resets spotlight controls between the two lessons.
export default function SpotlightDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useSpotlightStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('spotlightUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas shadows camera={{ position: [6, 4, 8], fov: 45 }} dpr={[1, 2]}><SpotlightScene /></Canvas></div>
}

// The panel changes cone settings and the optional patterned caster.
export function SpotlightPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useSpotlightStore()
  const fields = [['lightX', -3, 3, 0.1], ['angle', 0.15, 0.8, 0.05], ['opacity', 0, 1, 0.05], ...(name === 'SpotLightShadow' ? [['distance', 0.1, 0.8, 0.05]] : [])]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('spotlightUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`spotlightUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{name === 'SpotLightShadow' && <Button aria-pressed={state.mask} onClick={() => state.setValue('mask', !state.mask)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.mask ? 'spotlightUI.maskOn' : 'spotlightUI.maskOff')}</Button>}<p className='text-xs leading-6 text-slate-500'>{t('shadowBasicsUI.orbitHint')}</p></section>
}
