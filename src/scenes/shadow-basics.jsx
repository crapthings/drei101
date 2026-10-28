import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Backdrop, ContactShadows, OrbitControls, Shadow, SoftShadows } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The shared controls adjust object placement, light direction and shadow appearance.
export const useShadowBasicsStore = create((set) => ({ x: 0, height: 0.5, lightX: 3, blur: 2, colorStop: 0.4, opacity: 0.7, size: 20, floor: 0.5, enabled: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ x: 0, height: 0.5, lightX: 3, blur: 2, colorStop: 0.4, opacity: 0.7, size: 20, floor: 0.5, enabled: true }) }))

// The scene compares a simple painted shadow, a depth-based contact shadow and a shadow map.
function ShadowScene () {
  const { name } = useParams()
  const { x, height, lightX, blur, colorStop, opacity, size, floor, enabled } = useShadowBasicsStore()
  const backdrop = name === 'Backdrop'
  const soft = name === 'SoftShadows'
  return <><color attach='background' args={['#e0e7ff']} />{soft && enabled && <SoftShadows size={size} samples={16} focus={0} />}<directionalLight castShadow={soft || backdrop} position={[lightX, 6, 4]} intensity={3} shadow-mapSize={[1024, 1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0003} /><directionalLight position={[-4, 3, -2]} intensity={0.8} />{backdrop ? <Backdrop receiveShadow floor={floor} segments={32} scale={[6, 6, 6]} position={[0, 0.02, 0]}><meshStandardMaterial color='#c7d2fe' roughness={0.8} /></Backdrop> : <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.02, 0]}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='#f8fafc' /></mesh>}<mesh castShadow position={[x, height + 0.65, 0]}><sphereGeometry args={[0.65, 32, 24]} /><meshStandardMaterial color='#6366f1' roughness={0.38} /></mesh>{name === 'ContactShadows' && <ContactShadows position={[0, 0, 0]} scale={7} blur={blur} opacity={opacity} far={4} resolution={512} />}{name === 'Shadow' && <Shadow position={[x, 0.005, 0]} scale={2} opacity={opacity} colorStop={colorStop} />}{backdrop && <mesh castShadow position={[-1.6, 0.5, -0.6]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='#f59e0b' /></mesh>}<OrbitControls makeDefault target={[0, 0.8, 0]} minDistance={5} maxDistance={16} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The canvas resets controls per lesson and enables the renderer's shadow map.
export default function ShadowBasicsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useShadowBasicsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('shadowBasicsUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas shadows camera={{ position: [5, 4, 8], fov: 45 }} dpr={[1, 2]}><ShadowScene /></Canvas></div>
}

// The panel shows only the settings relevant to the selected shadow or backdrop.
export function ShadowBasicsPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useShadowBasicsStore()
  const fields = name === 'Backdrop' ? [['floor', 0, 2, 0.1], ['lightX', -5, 5, 0.5], ['x', -2, 2, 0.1]] : name === 'SoftShadows' ? [['size', 0, 50, 1], ['lightX', -5, 5, 0.5], ['height', 0, 2, 0.1]] : [['x', -2, 2, 0.1], ['height', 0, 2, 0.1], ...(name === 'Shadow' ? [['colorStop', 0, 0.8, 0.02]] : [['blur', 0, 4, 0.1]]), ['opacity', 0, 1, 0.05]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('shadowBasicsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`shadowBasicsUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{name === 'SoftShadows' && <Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'shadowBasicsUI.softOn' : 'shadowBasicsUI.softOff')}</Button>}<p className='text-xs leading-6 text-slate-500'>{t('shadowBasicsUI.orbitHint')}</p></section>
}
