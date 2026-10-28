import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshPortalMaterial, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the portal blend and movement within its scene.
export const usePortalStore = create((set) => ({ blend: 0, x: 0, setValue: (key, value) => set({ [key]: value }), reset: () => set({ blend: 0, x: 0 }) }))

// The portal's child scene contains a moving object and a contrasting background.
function PortalWorld () {
  const x = usePortalStore((state) => state.x)
  const mesh = useRef(null)
  useFrame((state, delta) => { if (mesh.current) mesh.current.rotation.y += delta * 0.5 })
  return <><color attach='background' args={['#312e81']} /><directionalLight position={[2, 4, 4]} intensity={3} /><mesh ref={mesh} position={[x, 0, -1]}><torusKnotGeometry args={[0.7, 0.23, 128, 24]} /><meshStandardMaterial color='#fbbf24' /></mesh><gridHelper args={[8, 8, '#818cf8', '#4f46e5']} position={[0, -1.2, -1]} /></>
}

// The main canvas renders the portal on a circular mesh and blends into its world.
export default function PortalMaterialDemo () {
  const { t } = useTranslation()
  const { blend, reset } = usePortalStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('portalUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#e0e7ff']} /><ResponsiveFraming halfWidth={2.2} minimumDistance={6} frontDepth={0} /><directionalLight position={[3, 4, 5]} intensity={3} /><mesh position={[-2, 0, 0]}><boxGeometry args={[0.7, 0.7, 0.7]} /><meshStandardMaterial color='#818cf8' /></mesh><mesh><circleGeometry args={[1.5, 64]} /><MeshPortalMaterial blend={blend}><PortalWorld /></MeshPortalMaterial></mesh><OrbitControls makeDefault minDistance={4} maxDistance={12} /></Canvas></div>
}

// The panel blends into the portal and moves its inner object.
export function PortalMaterialPanel () {
  const { t } = useTranslation()
  const state = usePortalStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('portalUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['blend', 0, 1, 0.05], ['x', -1, 1, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`portalUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'x' ? ' m' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('portalUI.hint')}</p></section>
}
