import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraShake, Float, Trail, useTrail } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BufferAttribute } from 'three'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares motion speed, strength and trail length with the current scene.
export const useAnimationBasicsStore = create((set) => ({ speed: 1, strength: 1, length: 8, enabled: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ speed: 1, strength: 1, length: 8, enabled: true }) }))

// The target moves around a stable path and supplies its object to the trail hook.
function MovingTarget ({ onTarget }) {
  const ref = useRef(null)
  const time = useRef(0)
  const { speed, enabled } = useAnimationBasicsStore()
  const setRef = useCallback((node) => { ref.current = node; onTarget?.(node) }, [onTarget])
  useFrame((_, delta) => { if (!ref.current || !enabled) return; time.current += delta * speed; const t = time.current; ref.current.position.set(Math.sin(t) * 2, Math.sin(t * 2) * 0.9, 0) }, -1)
  return <mesh ref={setRef}><sphereGeometry args={[0.18, 20, 20]} /><meshBasicMaterial color='#f59e0b' /></mesh>
}

// The hook example renders the sampled positions as a simple Three.js line.
function SampledTrail () {
  const [target, setTarget] = useState(null)
  const { length } = useAnimationBasicsStore()
  const points = useTrail(target, { length, interval: 2 })
  const geometry = useRef(null)
  useFrame(() => { if (!points.current || !geometry.current) return; const array = points.current; const current = geometry.current.getAttribute('position'); if (!current || current.array.length !== array.length) geometry.current.setAttribute('position', new BufferAttribute(new Float32Array(array.length), 3)); const attribute = geometry.current.getAttribute('position'); attribute.array.set(array); attribute.needsUpdate = true; geometry.current.setDrawRange(0, array.length / 3); geometry.current.computeBoundingSphere() })
  return <><MovingTarget onTarget={setTarget} /><line><bufferGeometry ref={geometry} /><lineBasicMaterial color='#4f46e5' /></line></>
}

// The shake controller updates the existing instance because intensity is an initial value.
function ShakeController () {
  const ref = useRef(null)
  const { strength, enabled } = useAnimationBasicsStore()
  useEffect(() => { ref.current?.setIntensity(enabled ? strength : 0) }, [strength, enabled])
  return <CameraShake ref={ref} maxYaw={0.18} maxPitch={0.12} maxRoll={0.08} yawFrequency={0.8} pitchFrequency={0.7} rollFrequency={0.9} />
}

// The scene selects a floating object, camera shake, component trail or sampled trail.
function BasicsScene () {
  const { name } = useParams()
  const { speed, strength, length, enabled } = useAnimationBasicsStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.5} minimumDistance={8} frontDepth={1} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} />{name === 'Float' ? <><mesh position={[-1.7, 0, 0]}><boxGeometry args={[1.2, 1.2, 1.2]} /><meshStandardMaterial color='#f59e0b' /></mesh><Float position={[1.7, 0, 0]} enabled={enabled} speed={speed} floatIntensity={strength} rotationIntensity={strength} floatingRange={[-0.8, 0.8]}><mesh><boxGeometry args={[1.2, 1.2, 1.2]} /><meshStandardMaterial color='#6366f1' /></mesh></Float></> : name === 'CameraShake' ? <><ShakeController /><mesh position={[0, 0, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color='#6366f1' /></mesh><mesh position={[-2.5, 1.2, -1]}><sphereGeometry args={[0.35, 20, 20]} /><meshStandardMaterial color='#f59e0b' /></mesh><mesh position={[2.5, -1.2, -1]}><sphereGeometry args={[0.35, 20, 20]} /><meshStandardMaterial color='#f59e0b' /></mesh></> : name === 'Trail' ? <Trail width={strength} length={length} color='#4f46e5' attenuation={(value) => value}><MovingTarget /></Trail> : <SampledTrail />}</>
}

// The canvas resets animation controls when entering or leaving each page.
export default function AnimationBasicsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useAnimationBasicsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('animationBasicsUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><BasicsScene /></Canvas>{name === 'Float' && <div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between gap-2 text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('animationBasicsUI.static')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('animationBasicsUI.moving')}</span></div>}</div>
}

// The panel adjusts motion speed, intensity and the number of recorded positions.
export function AnimationBasicsPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useAnimationBasicsStore()
  const fields = name === 'Float' ? [['speed', 0, 4, 0.1], ['strength', 0, 2, 0.1]] : name === 'CameraShake' ? [['strength', 0, 1, 0.05]] : [['speed', 0, 3, 0.1], ['length', 2, 20, 1], ...(name === 'Trail' ? [['strength', 0.2, 3, 0.1]] : [])]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('animationBasicsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`animationBasicsUI.${name === 'Trail' && key === 'strength' ? 'width' : key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'animationBasicsUI.on' : 'animationBasicsUI.off')}</Button><p className='text-xs leading-6 text-slate-500'>{t('animationBasicsUI.hint')}</p></section>
}
