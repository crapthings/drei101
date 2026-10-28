import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Detailed } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls camera distance and reports the active LOD and its triangle count.
export const useDetailedStore = create((set) => ({ distance: 5, level: 0, triangles: 0, setDistance: (distance) => set({ distance }), report: (level, triangles) => set((state) => state.level === level && state.triangles === triangles ? state : { level, triangles }), reset: () => set({ distance: 5, level: 0, triangles: 0 }) }))

// The scene moves the camera and reads the selected object from the actual LOD.
function DetailedScene () {
  const lod = useRef()
  const distance = useDetailedStore((state) => state.distance)
  const report = useDetailedStore((state) => state.report)
  const camera = useThree((state) => state.camera)
  useEffect(() => { camera.position.set(0, 0, distance); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix() }, [camera, distance])
  useFrame(() => { if (!lod.current) return; const level = lod.current.getCurrentLevel(); const geometry = lod.current.levels[level]?.object.geometry; if (geometry) report(level, geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3) })
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, 2, -4]} intensity={0.8} /><Detailed ref={lod} distances={[0, 8, 14]}><mesh><sphereGeometry args={[1.5, 48, 32]} /><meshStandardMaterial color='#6366f1' flatShading /></mesh><mesh><sphereGeometry args={[1.5, 16, 12]} /><meshStandardMaterial color='#f97316' flatShading /></mesh><mesh><icosahedronGeometry args={[1.5, 0]} /><meshStandardMaterial color='#10b981' flatShading /></mesh></Detailed></>
}

// The demo renders the three levels with a fixed camera looking toward the origin.
export default function DetailedDemo () {
  const { t } = useTranslation()
  const reset = useDetailedStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('detailedUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}><DetailedScene /></Canvas></div>
}

// The panel adjusts camera distance and shows the currently rendered geometry's triangle count.
export function DetailedPanel () {
  const { t } = useTranslation()
  const { distance, level, triangles, setDistance, reset } = useDetailedStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('detailedUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('detailedUI.distance')}</span><span>{distance} m</span></span><input type='range' min='4' max='20' step='0.5' value={distance} onChange={(event) => setDistance(Number(event.target.value))} className='w-full accent-indigo-600' /></label><div role='status' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'><p>{t('detailedUI.level')}: {t(`detailedUI.level${level}`)}</p><p>{t('detailedUI.triangles')}: {triangles}</p></div></section>
}
