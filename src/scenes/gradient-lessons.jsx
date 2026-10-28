import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { GradientTexture, GradientType } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store selects a gradient type and the position of its middle color stop.
export const useGradientStore = create((set) => ({ type: 'linear', middle: 0.5, setValue: (key, value) => set({ [key]: value }), reset: () => set({ type: 'linear', middle: 0.5 }) }))

// The surface displays a canvas-generated texture with linear or radial interpolation.
function GradientScene () {
  const { type, middle } = useGradientStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.1} minimumDistance={6} frontDepth={0} /><mesh><planeGeometry args={[3.5, 3.5]} /><meshBasicMaterial toneMapped={false}><GradientTexture key={`${type}-${middle}`} type={type === 'linear' ? GradientType.Linear : GradientType.Radial} stops={[0, middle, 1]} colors={['#4f46e5', '#a5b4fc', '#fbbf24']} width={512} size={512} /></meshBasicMaterial></mesh></>
}

// The canvas resets the gradient controls for each lesson.
export default function GradientDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useGradientStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('gradientUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><GradientScene /></Canvas></div>
}

// The panel switches gradient type and adjusts the middle color stop.
export function GradientPanel () {
  const { t } = useTranslation()
  const state = useGradientStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('gradientUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><div className='space-y-2'><p className='text-xs text-slate-600'>{t('gradientUI.type')}</p><div className='grid grid-cols-2 gap-2'>{['linear', 'radial'].map((type) => <Button key={type} aria-pressed={state.type === type} onClick={() => state.setValue('type', type)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${state.type === type ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(`gradientUI.${type}`)}</Button>)}</div></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('gradientUI.middle')}</span><span className='font-mono'>{state.middle}</span></span><input type='range' min='0.05' max='0.95' step='0.05' value={state.middle} onChange={(event) => state.setValue('middle', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label></section>
}
