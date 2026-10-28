import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Mask, useMask } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares the stencil shape and comparison mode between the scene and panel.
export const useStencilStore = create((set) => ({ x: 0, radius: 1.1, inverse: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ x: 0, radius: 1.1, inverse: false }) }))

// The stencil consumer applies the exported hook's material settings to a striped surface.
function MaskedSurface () {
  const inverse = useStencilStore((state) => state.inverse)
  const stencil = useMask(1, inverse)
  return <group position={[0, 0, -0.1]}><mesh><planeGeometry args={[4, 3]} /><meshBasicMaterial color='#a5b4fc' {...stencil} /></mesh>{[-1.5, -0.5, 0.5, 1.5].map((x) => <mesh key={x} position={[x, 0, 0.01]}><planeGeometry args={[0.5, 3]} /><meshBasicMaterial color='#4f46e5' {...stencil} /></mesh>)}</group>
}

// The scene writes a movable circular stencil and uses it to clip a colored surface.
function StencilScene () {
  const { x, radius } = useStencilStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.3} minimumDistance={6} frontDepth={0} /><Mask id={1} position={[x, 0, 0]}><circleGeometry args={[radius, 64]} /><meshBasicMaterial /></Mask><MaskedSurface /></>
}

// The canvas explicitly enables the stencil buffer and resets each lesson on navigation.
export default function StencilDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useStencilStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('stencilUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas gl={{ stencil: true }} camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><StencilScene /></Canvas></div>
}

// The panel moves and resizes the stencil and switches between inside and outside.
export function StencilPanel () {
  const { t } = useTranslation()
  const state = useStencilStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('stencilUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['x', -1.5, 1.5, 0.1], ['radius', 0.3, 1.5, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`stencilUI.${key}`)}</span><span className='font-mono'>{state[key]} m</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Button aria-pressed={state.inverse} onClick={() => state.setValue('inverse', !state.inverse)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.inverse ? 'stencilUI.outside' : 'stencilUI.inside')}</Button></section>
}
