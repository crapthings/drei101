import { useEffect, useMemo } from 'react'
import { Canvas, createPortal } from '@react-three/fiber'
import { PerspectiveCamera, useDepthBuffer } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { Scene } from 'three'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares object distance and the captured depth texture with the display.
export const useDepthStore = create((set) => ({ z: 0, texture: null, setValue: (key, value) => set({ [key]: value }), setTexture: (texture) => set({ texture }), reset: () => set({ z: 0 }) }))

// The geometry is reused in the visible scene and the separate depth capture.
function Objects () {
  const z = useDepthStore((state) => state.z)
  return <><mesh position={[-0.65, 0, z]}><sphereGeometry args={[0.6, 32, 24]} /><meshNormalMaterial /></mesh><mesh position={[0.7, 0, -1]}><boxGeometry args={[1, 1, 1]} /><meshNormalMaterial /></mesh></>
}

// The hook captures depth from its portal scene and publishes the texture for display.
function DepthCapture () {
  const depth = useDepthBuffer({ size: 512, frames: Infinity })
  const setTexture = useDepthStore((state) => state.setTexture)
  useEffect(() => { setTexture(depth); return () => setTexture(null) }, [depth, setTexture])
  return <><PerspectiveCamera makeDefault manual aspect={1} position={[0, 0, 5]} near={0.5} far={10} /><Objects /></>
}

// The shader converts perspective depth into a visible near-to-far grayscale value.
function DepthDisplay () {
  const texture = useDepthStore((state) => state.texture)
  const uniforms = useMemo(() => ({ depthMap: { value: texture }, near: { value: 0.5 }, far: { value: 10 } }), [texture])
  return <mesh position={[1.8, 0, 0]}><planeGeometry args={[3, 3]} /><shaderMaterial uniforms={uniforms} vertexShader='varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }' fragmentShader='uniform sampler2D depthMap; uniform float near; uniform float far; varying vec2 vUv; void main() { float d = texture2D(depthMap, vUv).x; float z = (2.0 * near * far) / (far + near - (2.0 * d - 1.0) * (far - near)); float value = 1.0 - clamp((z - near) / (far - near), 0.0, 1.0); gl_FragColor = vec4(vec3(value), 1.0); }' /></mesh>
}

// The canvas compares visible geometry with its separately captured depth texture.
export default function DepthBufferDemo () {
  const { t } = useTranslation()
  const reset = useDepthStore((state) => state.reset)
  const scene = useMemo(() => new Scene(), [])
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('depthUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.5} minimumDistance={8} frontDepth={1.5} /><group position={[-1.8, 0, 0]}><Objects /></group>{createPortal(<DepthCapture />, scene)}<DepthDisplay /></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('depthUI.color')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('depthUI.depth')}</span></div></div>
}

// The panel moves the sphere toward or away from the capture camera.
export function DepthBufferPanel () {
  const { t } = useTranslation()
  const state = useDepthStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('depthUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('depthUI.z')}</span><span className='font-mono'>{state.z} m</span></span><input type='range' min='-2' max='2' step='0.1' value={state.z} onChange={(event) => state.setValue('z', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><p className='text-xs leading-6 text-slate-500'>{t('depthUI.hint')}</p></section>
}
