import { useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Hud, OrthographicCamera } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the main camera angle and the HUD visibility.
export const useHudStore = create((set) => ({ angle: 0, visible: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ angle: 0, visible: true }) }))

// The main camera circles the subject while keeping the HUD camera independent.
function CameraRig () {
  const angle = useHudStore((state) => state.angle)
  useFrame(({ camera }) => { const radians = angle * Math.PI / 180; const distance = camera.position.length(); camera.position.set(Math.sin(radians) * distance, 0, Math.cos(radians) * distance); camera.lookAt(0, 0, 0) }, -1)
  return null
}

// The overlay anchors a flat marker near the upper right of the viewport.
function Overlay () {
  const size = useThree((state) => state.size)
  return <><OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} /><group position={[Math.max(0, size.width / 200 - 0.65), Math.max(0, size.height / 200 - 0.65), 0]}><mesh><circleGeometry args={[0.4, 48]} /><meshBasicMaterial color='#4f46e5' /></mesh><mesh position={[0, 0, 0.01]}><ringGeometry args={[0.23, 0.27, 48]} /><meshBasicMaterial color='white' /></mesh><mesh position={[0, 0, 0.02]}><circleGeometry args={[0.06, 24]} /><meshBasicMaterial color='#fbbf24' /></mesh></group></>
}

// The main scene combines a rotating view of an object with a fixed HUD layer.
export default function HudDemo () {
  const { t } = useTranslation()
  const { visible, reset } = useHudStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('hudUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2} minimumDistance={6} frontDepth={0} /><CameraRig /><directionalLight position={[3, 5, 5]} intensity={3} /><mesh><torusKnotGeometry args={[1, 0.3, 128, 24]} /><meshStandardMaterial color='#818cf8' roughness={0.4} /></mesh>{visible && <Hud><Overlay /></Hud>}</Canvas></div>
}

// The panel adjusts the main camera and toggles the overlay for comparison.
export function HudPanel () {
  const { t } = useTranslation()
  const state = useHudStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('hudUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('hudUI.angle')}</span><span className='font-mono'>{state.angle}°</span></span><input type='range' min='-90' max='90' step='1' value={state.angle} onChange={(event) => state.setValue('angle', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><Button aria-pressed={state.visible} onClick={() => state.setValue('visible', !state.visible)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.visible ? 'hudUI.on' : 'hudUI.off')}</Button></section>
}
