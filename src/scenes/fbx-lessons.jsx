import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Fbx, useFBX } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The local ASCII FBX contains one faceted mesh with positions and normals.
const modelUrl = `${import.meta.env.BASE_URL}models/gem.fbx`

// The store controls the displayed model transform independently of its source file.
export const useFbxStore = create((set) => ({ rotation: 0.4, scale: 1, setValue: (key, value) => set({ [key]: value }), reset: () => set({ rotation: 0.4, scale: 1 }) }))

// The hook loads the FBX group and places it directly into the scene.
function HookModel () {
  const object = useFBX(modelUrl)
  const { rotation, scale } = useFbxStore()
  return <group rotation-y={rotation} scale={scale}><primitive object={object} /></group>
}

// The component loads the first child of the FBX group as a clone.
function ComponentModel () {
  const { rotation, scale } = useFbxStore()
  return <Fbx path={modelUrl} rotation-y={rotation} scale={scale} />
}

// The canvas displays the locally loaded FBX under directional lighting.
export default function FbxDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useFbxStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('fbxUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.6} minimumDistance={7} frontDepth={1.5} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, 4]} intensity={0.8} /><Suspense fallback={null}>{name === 'Fbx' ? <ComponentModel /> : <HookModel />}</Suspense></Canvas></div>
}

// The panel changes the model rotation and scale.
export function FbxPanel () {
  const { t } = useTranslation()
  const state = useFbxStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('fbxUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['rotation', -3, 3, 0.1], ['scale', 0.5, 1.5, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`fbxUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='break-all rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-700'>/models/gem.fbx</p></section>
}
