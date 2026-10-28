import { useCallback, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sampler, useSurfaceSampler } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store controls the number of sampled instances and resampling.
export const useSamplerStore = create((set) => ({ count: 200, revision: 0, setCount: (count) => set({ count }), resample: () => set((state) => ({ revision: state.revision + 1 })), reset: () => set({ count: 200, revision: 0 }) }))

// The transform places each marker on its sampled surface position.
function placeSample ({ dummy, position }) {
  dummy.position.copy(position).multiplyScalar(1.025)
  dummy.scale.setScalar(1)
}

// The hook writes sampled transforms directly into an instanced mesh.
function HookSamples ({ count }) {
  const mesh = useRef()
  const instances = useRef()
  const transform = useCallback(placeSample, [])
  useSurfaceSampler(mesh, count, transform, undefined, instances)
  return <><mesh ref={mesh}><sphereGeometry args={[1.5, 32, 24]} /><meshStandardMaterial color='#c7d2fe' /></mesh><instancedMesh ref={instances} args={[null, null, count]}><sphereGeometry args={[0.045, 8, 6]} /><meshBasicMaterial color='#f97316' /></instancedMesh></>
}

// The component locates its mesh and instanced mesh children and samples them.
function ComponentSamples ({ count }) {
  return <Sampler count={count} transform={placeSample}><mesh><sphereGeometry args={[1.5, 32, 24]} /><meshStandardMaterial color='#c7d2fe' /></mesh><instancedMesh args={[null, null, count]}><sphereGeometry args={[0.045, 8, 6]} /><meshBasicMaterial color='#f97316' /></instancedMesh></Sampler>
}

// The scene remounts sampling when count or resampling revision changes.
export default function SamplerDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { count, revision, reset } = useSamplerStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('samplerUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [3, 2, 6], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, -1, -4]} intensity={1} />{name === 'Sampler' ? <ComponentSamples key={`${count}-${revision}`} count={count} /> : <HookSamples key={`${count}-${revision}`} count={count} />}<OrbitControls makeDefault minDistance={4} maxDistance={12} /></Canvas></div>
}

// The panel adjusts sample count and starts a new random distribution.
export function SamplerPanel () {
  const { t } = useTranslation()
  const { count, setCount, resample, reset } = useSamplerStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('samplerUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('samplerUI.count')}</span><span>{count}</span></span><input type='range' min='50' max='500' step='50' value={count} onChange={(event) => setCount(Number(event.target.value))} className='w-full accent-indigo-600' /></label><Button onClick={resample} className='w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t('samplerUI.resample')}</Button></section>
}
