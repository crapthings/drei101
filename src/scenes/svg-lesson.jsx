import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Svg } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares SVG scale and fill and stroke visibility.
export const useSvgStore = create((set) => ({ scale: 0.015, fill: true, stroke: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ scale: 0.015, fill: true, stroke: true }) }))

// The scene loads a local SVG and centers its 200-by-120 coordinate space.
function SvgScene () {
  const { scale, fill, stroke } = useSvgStore()
  return <><ResponsiveFraming halfWidth={3.2} minimumDistance={8} /><color attach='background' args={['#eef2ff']} /><Suspense fallback={null}><Svg src={`${import.meta.env.BASE_URL}images/vector-demo.svg`} position={[-100 * scale, 60 * scale, 0]} scale={scale} skipFill={!fill} skipStrokes={!stroke} /></Suspense></>
}

// The canvas resets SVG display settings on entry and exit.
export default function SvgDemo () {
  const { t } = useTranslation()
  const reset = useSvgStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('svgUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><SvgScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('svgUI.legend')}</span></div>
}

// The panel toggles fill and stroke geometry and changes the SVG scale.
export function SvgPanel () {
  const { t } = useTranslation()
  const state = useSvgStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('svgUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t('svgUI.scale')}</span><span className='font-mono'>{state.scale.toFixed(3)}</span></span><input type='range' min='0.005' max='0.025' step='0.001' value={state.scale} onChange={(event) => state.setValue('scale', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>{['fill', 'stroke'].map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`svgUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}<p className='text-xs leading-6 text-slate-500'>{t('svgUI.hint')}</p></section>
}
