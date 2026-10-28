import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { DoubleSide } from 'three'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares radius, horizontal and vertical segmentation, angular coverage and wireframe.
export const useSphereStore = create((set) => ({ radius: 1.5, widthSegments: 32, heightSegments: 16, phi: 360, theta: 180, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ radius: 1.5, widthSegments: 32, heightSegments: 16, phi: 360, theta: 180, wireframe: false }) }))

// The scene shows a sphere or partial spherical surface with double-sided material.
function SphereScene () {
  const { radius, widthSegments, heightSegments, phi, theta, wireframe } = useSphereStore()
  return <><ResponsiveFraming halfWidth={2.2} minimumDistance={7} frontDepth={2} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Sphere args={[radius, widthSegments, heightSegments, 0, phi * Math.PI / 180, 0, theta * Math.PI / 180]} rotation={[-0.2, 0.4, 0]}><meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} side={DoubleSide} /></Sphere></>
}

// The canvas resets sphere settings when the lesson is entered or left.
export default function SphereDemo () {
  const { t } = useTranslation()
  const reset = useSphereStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('sphereUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><SphereScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('sphereUI.legend')}</span></div>
}

// The panel controls radius, mesh resolution and horizontal and vertical sweeps.
export function SpherePanel () {
  const { t } = useTranslation()
  const state = useSphereStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('sphereUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['radius', 0.5, 2, 0.1], ['widthSegments', 3, 64, 1], ['heightSegments', 2, 48, 1], ['phi', 30, 360, 5], ['theta', 15, 180, 5]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`sphereUI.${key}`)}</span><span className='font-mono'>{key === 'radius' ? `${state[key].toFixed(1)} m` : `${state[key]}${key === 'phi' || key === 'theta' ? '°' : ''}`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('sphereUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('sphereUI.hint')}</p></section>
}
