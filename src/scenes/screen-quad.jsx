import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ScreenQuad } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The vertex shader sends the oversized triangle directly to clip space.
const vertexShader = `varying vec2 vScreenUv;
void main() {
  vScreenUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

// The fragment shader draws adjustable bands over a light indigo gradient.
const fragmentShader = `uniform float uBands;
varying vec2 vScreenUv;
void main() {
  float wave = 0.5 + 0.5 * sin(vScreenUv.x * uBands * 6.2831853);
  vec3 color = mix(vec3(0.93, 0.94, 1.0), vec3(0.31, 0.27, 0.90), 0.2 + 0.6 * wave * vScreenUv.y);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

// The store shares the shader band count and camera distance.
export const useScreenQuadStore = create((set) => ({ bands: 4, cameraZ: 5, setValue: (key, value) => set({ [key]: value }), reset: () => set({ bands: 4, cameraZ: 5 }) }))

// The scene updates a shader uniform and camera position independently.
function ScreenQuadScene () {
  const { bands, cameraZ } = useScreenQuadStore()
  const camera = useThree((state) => state.camera)
  const material = useRef(null)
  const uniforms = useMemo(() => ({ uBands: { value: 4 } }), [])
  useEffect(() => { if (material.current) material.current.uniforms.uBands.value = bands }, [bands])
  useEffect(() => { camera.position.z = cameraZ; camera.updateProjectionMatrix() }, [camera, cameraZ])
  return <ScreenQuad><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthTest={false} depthWrite={false} /></ScreenQuad>
}

// The canvas resets its shader and camera controls on entry and exit.
export default function ScreenQuadDemo () {
  const { t } = useTranslation()
  const reset = useScreenQuadStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('screenQuadUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}><ScreenQuadScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('screenQuadUI.legend')}</span></div>
}

// The panel adjusts shader frequency and camera distance for comparison.
export function ScreenQuadPanel () {
  const { t } = useTranslation()
  const state = useScreenQuadStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('screenQuadUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['bands', 1, 12, 1], ['cameraZ', 2, 10, 0.5]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`screenQuadUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'cameraZ' ? ' m' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('screenQuadUI.hint')}</p></section>
}
