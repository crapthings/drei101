import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Text, Text3D } from '@react-three/drei'
import { Button, Field, Label, Select, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares typographic and extrusion settings between the two lessons.
export const useTextStore = create((set) => ({ size: 0.7, width: 3, spacing: 0, align: 'left', depth: 0.3, bevel: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ size: 0.7, width: 3, spacing: 0, align: 'left', depth: 0.3, bevel: false }) }))

// The scene renders SDF layout or extruded text using local font assets.
function TextScene () {
  const { name } = useParams()
  const { size, width, spacing, align, depth, bevel } = useTextStore()
  const base = import.meta.env.BASE_URL
  return <><ResponsiveFraming halfWidth={3.4} minimumDistance={8} frontDepth={1} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Suspense fallback={null}>{name === 'Text' ? <Text font={`${base}fonts/roboto-regular.ttf`} fontSize={size} maxWidth={width} letterSpacing={spacing} textAlign={align} anchorX='center' anchorY='middle' color='#4f46e5'>{'THREE DIMENSIONAL\nTYPE IN SPACE'}</Text> : <group rotation={[0, -0.35, 0]}><Center cacheKey={`${size}-${depth}-${bevel}`}><Text3D font={`${base}fonts/helvetiker_regular.typeface.json`} size={size} height={depth} bevelEnabled={bevel} bevelSize={0.04} bevelThickness={0.04} bevelSegments={3} curveSegments={8}><meshStandardMaterial color='#6366f1' roughness={0.4} />DREI</Text3D></Center></group>}</Suspense></>
}

// Each text lesson starts with its own default layout and extrusion state.
export default function TextDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useTextStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('textUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><TextScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('textUI.legend')}</span></div>
}

// The panel exposes wrapping and alignment for Text and depth and bevel for Text3D.
export function TextPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useTextStore()
  const fields = name === 'Text' ? [['size', 0.3, 1, 0.05], ['width', 1.5, 5, 0.1], ['spacing', -0.05, 0.2, 0.01]] : [['size', 0.3, 1, 0.05], ['depth', 0.05, 1, 0.05]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('textUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`textUI.${key}`)}</span><span className='font-mono'>{state[key].toFixed(2)}{key === 'spacing' ? '' : ' m'}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{name === 'Text' ? <label className='block space-y-2 text-xs text-slate-600'><span>{t('textUI.align')}</span><Select value={state.align} onChange={(event) => state.setValue('align', event.target.value)} className='block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500'>{['left', 'center', 'right'].map((value) => <option key={value} value={value}>{t(`textUI.${value}`)}</option>)}</Select></label> : <Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('textUI.bevel')}</Label><Switch checked={state.bevel} onChange={(value) => state.setValue('bevel', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>}<p className='text-xs leading-6 text-slate-500'>{t(name === 'Text' ? 'textUI.textHint' : 'textUI.text3dHint')}</p></section>
}
