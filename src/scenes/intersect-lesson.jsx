import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useIntersect } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store shares the object's horizontal position and render visibility feedback.
export const useIntersectStore = create((set) => ({ x: 0, visible: false, setX: (x) => set({ x }), setVisible: (visible) => set({ visible }), reset: () => set({ x: 0 }) }))

// The mesh reports whether Three.js rendered it during the current frame.
function ObservedBox () {
  const x = useIntersectStore((state) => state.x)
  const setVisible = useIntersectStore((state) => state.setVisible)
  const ref = useIntersect(setVisible)
  return <mesh ref={ref} position={[x, 0, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color='#6366f1' /></mesh>
}

// The canvas keeps the camera fixed so the object can move out of view.
export default function IntersectDemo () {
  const { t } = useTranslation()
  const reset = useIntersectStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('intersectUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, 2, -4]} intensity={0.8} /><ObservedBox /></Canvas></div>
}

// The panel moves the mesh and displays the hook's reported render status.
export function IntersectPanel () {
  const { t } = useTranslation()
  const { x, visible, setX, reset } = useIntersectStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('intersectUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('intersectUI.x')}</span><span>{x} m</span></span><input type='range' min='-15' max='15' step='0.5' value={x} onChange={(event) => setX(Number(event.target.value))} className='w-full accent-indigo-600' /></label><p role='status' className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t(visible ? 'intersectUI.visible' : 'intersectUI.hidden')}</p></section>
}
