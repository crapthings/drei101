import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Image, useAspect } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares image frame, shader controls and aspect-fitting scale.
export const useImageStore = create((set) => ({ width: 3, height: 2, zoom: 1, grayscale: 0, radius: 0, factor: 0.8, fitted: [0, 0], setValue: (key, value) => set({ [key]: value }), reset: () => set({ width: 3, height: 2, zoom: 1, grayscale: 0, radius: 0, factor: 0.8 }) }))

// The fitted image reports useAspect dimensions as the canvas viewport changes.
function AspectImage () {
  const factor = useImageStore((state) => state.factor)
  const scale = useAspect(960, 540, factor)
  useEffect(() => { useImageStore.setState({ fitted: [scale[0], scale[1]] }) }, [scale[0], scale[1]])
  return <Image url={`${import.meta.env.BASE_URL}images/crop-demo.svg`} scale={[scale[0], scale[1]]} />
}

// The scene displays either a configurable image frame or viewport-covering dimensions.
function ImageScene () {
  const { name } = useParams()
  const { width, height, zoom, grayscale, radius } = useImageStore()
  return <><color attach='background' args={['#eef2ff']} />{name === 'Image' && <ResponsiveFraming halfWidth={3} minimumDistance={7} />}<Suspense fallback={null}>{name === 'Image' ? <Image url={`${import.meta.env.BASE_URL}images/crop-demo.svg`} scale={[width, height]} zoom={zoom} grayscale={grayscale} radius={radius} transparent /> : <AspectImage />}</Suspense></>
}

// Each page starts with fresh image and aspect controls.
export default function ImageDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useImageStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('imageUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><ImageScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('imageUI.legend')}</span></div>
}

// The panel exposes frame and shader controls or the aspect-fitting factor.
export function ImagePanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useImageStore()
  const fields = name === 'Image' ? [['width', 1, 5, 0.1], ['height', 1, 4, 0.1], ['zoom', 1, 2, 0.05], ['grayscale', 0, 1, 0.05], ['radius', 0, 0.4, 0.05]] : [['factor', 0.3, 1, 0.05]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('imageUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`imageUI.${key}`)}</span><span className='font-mono'>{state[key].toFixed(2)}{key === 'width' || key === 'height' || key === 'radius' ? ' m' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{name === 'useAspect' && <p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900'>{t('imageUI.fitted')}: {state.fitted.map(value => value.toFixed(2)).join(' × ')} m</p>}<p className='text-xs leading-6 text-slate-500'>{t(name === 'Image' ? 'imageUI.imageHint' : 'imageUI.aspectHint')}</p></section>
}
