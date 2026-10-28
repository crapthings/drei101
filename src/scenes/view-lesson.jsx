import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, View } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls the orientation shared by the two view scenes.
export const useViewStore = create((set) => ({ angle: 0, setAngle: (angle) => set({ angle }), reset: () => set({ angle: 0 }) }))

// Each view renders a different object and camera into its tracked rectangle.
function ViewContent ({ second }) {
  const angle = useViewStore((state) => state.angle)
  return <><color attach='background' args={[second ? '#e0e7ff' : '#eef2ff']} /><PerspectiveCamera makeDefault position={second ? [2.3, 0, 5.5] : [0, 0, 6]} rotation={second ? [0, 0.4, 0] : [0, 0, 0]} fov={50} /><directionalLight position={[3, 5, 5]} intensity={3} /><mesh rotation={[0.3, angle * Math.PI / 180, 0]}>{second ? <boxGeometry args={[1.7, 1.7, 1.7]} /> : <torusKnotGeometry args={[0.8, 0.25, 128, 24]} />}<meshStandardMaterial color={second ? '#f59e0b' : '#6366f1'} /></mesh></>
}

// Two HTML rectangles are tracked by View and rendered through a single shared canvas.
export default function ViewDemo () {
  const { t } = useTranslation()
  const reset = useViewStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('viewUI.scene')} className='relative grid min-h-80 grid-cols-1 gap-3 overflow-hidden rounded-2xl border border-indigo-100 bg-white p-3 sm:grid-cols-2'><div className='relative'><View className='h-[40vh] min-h-64 overflow-hidden rounded-xl sm:h-[50vh]'><ViewContent /></View><span className='pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('viewUI.first')}</span></div><div className='relative'><View className='h-[40vh] min-h-64 overflow-hidden rounded-xl sm:h-[50vh]' index={2}><ViewContent second /></View><span className='pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('viewUI.second')}</span></div><Canvas className='pointer-events-none' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}><View.Port /></Canvas></div>
}

// The panel changes both scenes and demonstrates their independent views.
export function ViewPanel () {
  const { t } = useTranslation()
  const { angle, setAngle, reset } = useViewStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('viewUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('viewUI.angle')}</span><span className='font-mono'>{angle}°</span></span><input type='range' min='0' max='180' step='1' value={angle} onChange={(event) => setAngle(Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><p className='text-xs leading-6 text-slate-500'>{t('viewUI.hint')}</p></section>
}
