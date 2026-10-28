import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { CubeTexture, useCubeTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The six files are ordered along the positive and negative axes required by CubeTextureLoader.
const files = ['px.svg', 'nx.svg', 'py.svg', 'ny.svg', 'pz.svg', 'nz.svg']

// The store controls reflection strength and the surface roughness of the cube-map example.
export const useCubeTextureStore = create((set) => ({ intensity: 1, roughness: 0.1, enabled: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ intensity: 1, roughness: 0.1, enabled: true }) }))

// The metal sphere applies the loaded cube texture directly to its material.
function ReflectionSphere ({ texture }) {
  const { intensity, roughness, enabled } = useCubeTextureStore()
  return <mesh position={[1.7, 0, 0]}><sphereGeometry args={[1.15, 64, 48]} /><meshStandardMaterial color='#ffffff' metalness={1} roughness={roughness} envMap={enabled ? texture : null} envMapIntensity={intensity} /></mesh>
}

// The hook example returns the cube texture loaded from the six local files.
function HookReflection () {
  const texture = useCubeTexture(files, { path: `${import.meta.env.BASE_URL}images/environment/` })
  return <ReflectionSphere texture={texture} />
}

// The component example supplies the cube texture through a render function.
function ComponentReflection () {
  return <CubeTexture files={files} path={`${import.meta.env.BASE_URL}images/environment/`}>{(texture) => <ReflectionSphere texture={texture} />}</CubeTexture>
}

// The canvas contrasts a lit reference sphere with the cube-mapped metal sphere.
export default function CubeTextureDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useCubeTextureStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('cubeTextureUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.5} minimumDistance={8} /><directionalLight position={[3, 5, 6]} intensity={3} /><mesh position={[-1.7, 0, 0]}><sphereGeometry args={[1.15, 64, 48]} /><meshStandardMaterial color='#a5b4fc' metalness={1} roughness={0.1} /></mesh><Suspense fallback={null}>{name === 'CubeTexture' ? <ComponentReflection /> : <HookReflection />}</Suspense></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('cubeTextureUI.reference')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('cubeTextureUI.reflection')}</span></div></div>
}

// The panel adjusts the cube-map contribution and reflected surface roughness.
export function CubeTexturePanel () {
  const { t } = useTranslation()
  const state = useCubeTextureStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('cubeTextureUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['intensity', 0, 2, 0.1], ['roughness', 0, 1, 0.05]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`cubeTextureUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'cubeTextureUI.on' : 'cubeTextureUI.off')}</Button><p className='break-all rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-700'>px · nx · py · ny · pz · nz</p></section>
}
