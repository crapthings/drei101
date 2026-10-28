import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Effects } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The shader pass mixes the rendered image with a luminance-based grayscale version.
const grayscaleShader = { uniforms: { tDiffuse: { value: null }, amount: { value: 1 } }, vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: 'uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv; void main() { vec4 color = texture2D(tDiffuse, vUv); float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114)); gl_FragColor = vec4(mix(color.rgb, vec3(gray), amount), color.a); }' }

// The store controls whether the effect chain is mounted and its grayscale strength.
export const useEffectsStore = create((set) => ({ enabled: true, amount: 1, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, amount: 1 }) }))

// The canvas renders a colorful scene through the optional Drei effects composer.
export default function EffectsDemo () {
  const { t } = useTranslation()
  const { enabled, amount, reset } = useEffectsStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('effectsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#e0e7ff']} /><ResponsiveFraming halfWidth={2.8} minimumDistance={7} frontDepth={0.8} /><directionalLight position={[3, 5, 5]} intensity={3} /><mesh position={[-1.2, 0, 0]}><sphereGeometry args={[1, 48, 32]} /><meshStandardMaterial color='#4f46e5' /></mesh><mesh position={[1.2, 0, 0]} rotation={[0.4, 0.5, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color='#f59e0b' /></mesh>{enabled && <Effects multisamping={0}><shaderPass args={[grayscaleShader]} uniforms-amount-value={amount} /></Effects>}</Canvas></div>
}

// The panel toggles the composer and changes grayscale strength.
export function EffectsPanel () {
  const { t } = useTranslation()
  const state = useEffectsStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('effectsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'effectsUI.on' : 'effectsUI.off')}</Button><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('effectsUI.amount')}</span><span className='font-mono'>{state.amount}</span></span><input type='range' min='0' max='1' step='0.05' disabled={!state.enabled} value={state.amount} onChange={(event) => state.setValue('amount', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-40' /></label></section>
}
