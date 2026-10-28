import { useEffect } from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls, ShadowAlpha, shaderMaterial } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The vertex shader forwards UV coordinates to the fragment shader.
const vertexShader = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'

// The fragment shader blends two colors around the adjustable split uniform.
const fragmentShader = 'uniform float split; varying vec2 vUv; void main() { float f = smoothstep(split - 0.08, split + 0.08, vUv.x); gl_FragColor = vec4(mix(vec3(0.24, 0.20, 0.75), vec3(1.0, 0.70, 0.13), f), 1.0); }'

// The generated material exposes split as a property backed by a shader uniform.
const LessonGradientMaterial = shaderMaterial({ split: 0.5 }, vertexShader, fragmentShader)

// Register the generated material for declarative use inside the fiber scene.
extend({ LessonGradientMaterial })

// The store shares the gradient split and shadow opacity controls.
export const useShaderShadowStore = create((set) => ({ enabled: true, split: 0.5, opacity: 0.35, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, split: 0.5, opacity: 0.35 }) }))

// The shader scene compares a solid color with a uniform-controlled gradient.
function ShaderScene () {
  const { enabled, split } = useShaderShadowStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.7} minimumDistance={8} /><mesh position={[-1.7, 0, 0]}><planeGeometry args={[2.6, 2.6]} /><meshBasicMaterial color='#6366f1' /></mesh><mesh position={[1.7, 0, 0]}><planeGeometry args={[2.6, 2.6]} />{enabled ? <lessonGradientMaterial key={LessonGradientMaterial.key} split={split} /> : <meshBasicMaterial color='#6366f1' />}</mesh></>
}

// The shadow scene compares default opaque shadows with dithered alpha shadows.
function ShadowScene () {
  const { enabled, opacity } = useShaderShadowStore()
  return <><color attach='background' args={['#eef2ff']} /><directionalLight castShadow position={[0, 7, 4]} intensity={3} shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0005} /><directionalLight position={[-4, 3, -2]} intensity={0.6} /><mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.02, 0]}><planeGeometry args={[10, 8]} /><meshStandardMaterial color='#ffffff' /></mesh>{[-1.7, 1.7].map((x, index) => <mesh key={x} castShadow position={[x, 1.5, 0]} rotation={[0, 0.15, 0]}><boxGeometry args={[1.3, 1.3, 0.3]} /><meshStandardMaterial color='#6366f1' transparent opacity={opacity} />{index === 1 && enabled && <ShadowAlpha opacity={opacity} />}</mesh>)}<OrbitControls makeDefault target={[0, 0.8, 0]} minDistance={5} maxDistance={18} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The canvas selects the shader-uniform or transparent-shadow example.
export default function ShaderShadowDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useShaderShadowStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('shaderShadowUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas shadows camera={{ position: name === 'ShadowAlpha' ? [5, 5, 10] : [0, 0, 8], fov: 45 }} dpr={[1, 2]}>{name === 'ShadowAlpha' ? <ShadowScene /> : <ShaderScene />}</Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('shaderShadowUI.reference')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('shaderShadowUI.effect')}</span></div></div>
}

// The panel adjusts the relevant uniform or shadow opacity and toggles the effect.
export function ShaderShadowPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useShaderShadowStore()
  const key = name === 'ShadowAlpha' ? 'opacity' : 'split'
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('shaderShadowUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`shaderShadowUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min='0.05' max='0.95' step='0.05' value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'shaderShadowUI.on' : 'shaderShadowUI.off')}</Button>{name === 'ShadowAlpha' && <p className='text-xs leading-6 text-slate-500'>{t('shaderShadowUI.orbit')}</p>}</section>
}
