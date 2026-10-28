import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Clone, Gltf, useGLTF } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The local glTF contains a small multi-part robot with named meshes and materials.
const modelUrl = `${import.meta.env.BASE_URL}models/robot.gltf`

// The store adjusts the number and orientation of the displayed model instances.
export const useGltfStore = create((set) => ({ count: 2, rotation: 0.4, setValue: (key, value) => set({ [key]: value }), reset: () => set({ count: 2, rotation: 0.4 }) }))

// The hook scene uses the loaded original once and clones it for additional positions.
function HookModels ({ clonesOnly = false }) {
  const { scene } = useGLTF(modelUrl)
  const { count, rotation } = useGltfStore()
  return Array.from({ length: count }, (_, index) => <group key={index} position={[(index - (count - 1) / 2) * 2.2, 0, 0]} rotation-y={rotation * (index + 1)}>{!clonesOnly && index === 0 ? <primitive object={scene} /> : <Clone object={scene} />}</group>)
}

// The component scene loads and clones the source model for every position.
function ComponentModels () {
  const { count, rotation } = useGltfStore()
  return Array.from({ length: count }, (_, index) => <Gltf key={index} src={modelUrl} position={[(index - (count - 1) / 2) * 2.2, 0, 0]} rotation-y={rotation * (index + 1)} />)
}

// The canvas provides directional lighting and resets model controls on navigation.
export default function GltfDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useGltfStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('gltfUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={4.3} minimumDistance={9} frontDepth={0.7} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, 4]} intensity={1} /><Suspense fallback={null}>{name === 'Gltf' ? <ComponentModels /> : <HookModels clonesOnly={name === 'Clone'} />}</Suspense></Canvas></div>
}

// The panel changes instance count and rotation without changing the source file.
export function GltfPanel () {
  const { t } = useTranslation()
  const state = useGltfStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('gltfUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['count', 1, 3, 1], ['rotation', -1, 1, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`gltfUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='break-all rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-700'>/models/robot.gltf</p></section>
}
