import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Fisheye, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls the lens comparison and the fisheye zoom.
export const useFisheyeStore = create((set) => ({ enabled: true, zoom: 0, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, zoom: 0 }) }))

// The same scene is used for the normal and fisheye views.
function RoomContent () {
  return <><color attach='background' args={['#e0e7ff']} /><directionalLight position={[3, 5, 4]} intensity={3} /><directionalLight position={[-4, 2, -3]} intensity={1} /><gridHelper args={[14, 14, '#818cf8', '#c7d2fe']} position={[0, -1.2, 0]} /><mesh position={[0, 0, 0]}><torusKnotGeometry args={[0.8, 0.25, 128, 24]} /><meshStandardMaterial color='#4f46e5' roughness={0.4} /></mesh>{[[-3, 0, -2], [3, 0, -2], [-3, 0, 2], [3, 0, 2]].map(([x, y, z], index) => <mesh key={index} position={[x, y, z]}><boxGeometry args={[0.8, 2, 0.8]} /><meshStandardMaterial color={index % 2 ? '#f59e0b' : '#a5b4fc'} /></mesh>)}<OrbitControls makeDefault target={[0, 0, 0]} minDistance={3} maxDistance={10} /></>
}

// The canvas switches between a standard scene and the cube-captured fisheye scene.
export default function FisheyeDemo () {
  const { t } = useTranslation()
  const { enabled, zoom, reset } = useFisheyeStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('fisheyeUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 2, 6], fov: 50 }} dpr={[1, 2]}>{enabled ? <Fisheye zoom={zoom} resolution={256}><RoomContent /></Fisheye> : <RoomContent />}</Canvas></div>
}

// The panel toggles the lens and adjusts its zoom.
export function FisheyePanel () {
  const { t } = useTranslation()
  const state = useFisheyeStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('fisheyeUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'fisheyeUI.on' : 'fisheyeUI.off')}</Button><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('fisheyeUI.zoom')}</span><span className='font-mono'>{state.zoom}</span></span><input type='range' min='0' max='1' step='0.05' disabled={!state.enabled} value={state.zoom} onChange={(event) => state.setValue('zoom', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-40' /></label><p className='text-xs leading-6 text-slate-500'>{t('fisheyeUI.hint')}</p></section>
}
