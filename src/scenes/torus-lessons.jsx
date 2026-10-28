import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Torus, TorusKnot } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { DoubleSide } from 'three'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares torus dimensions, subdivisions, arc and knot preset.
export const useTorusStore = create((set) => ({ radius: 1.2, tube: 0.3, radial: 12, tubular: 64, arc: 360, alternateKnot: false, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ radius: 1.2, tube: 0.3, radial: 12, tubular: 64, arc: 360, alternateKnot: false, wireframe: false }) }))

// The scene constructs the route's geometry with its own argument order.
function TorusScene () {
  const { name } = useParams()
  const { radius, tube, radial, tubular, arc, alternateKnot, wireframe } = useTorusStore()
  const material = <meshStandardMaterial color='#6366f1' roughness={0.4} wireframe={wireframe} side={DoubleSide} />
  return <><ResponsiveFraming halfWidth={3.1} minimumDistance={9} frontDepth={2} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} />{name === 'Torus' ? <Torus args={[radius, tube, radial, tubular, arc * Math.PI / 180]} rotation={[-0.25, 0.35, 0]}>{material}</Torus> : <TorusKnot args={[radius, tube, tubular, radial, alternateKnot ? 3 : 2, alternateKnot ? 4 : 3]} rotation={[-0.25, 0.35, 0]}>{material}</TorusKnot>}</>
}

// Each route starts with fresh torus parameters.
export default function TorusDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useTorusStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('torusUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}><TorusScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('torusUI.legend')}</span></div>
}

// The panel controls dimensions, segment counts and shape-specific options.
export function TorusPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useTorusStore()
  const fields = [['radius', 0.8, 1.5, 0.1], ['tube', 0.1, 0.5, 0.05], ['radial', 3, 24, 1], ['tubular', 16, 128, 4], ...(name === 'Torus' ? [['arc', 30, 360, 5]] : [])]
  const switches = [...(name === 'TorusKnot' ? ['alternateKnot'] : []), 'wireframe']
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('torusUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`torusUI.${key}`)}</span><span className='font-mono'>{key === 'radius' || key === 'tube' ? `${state[key].toFixed(2)} m` : `${state[key]}${key === 'arc' ? '°' : ''}`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{switches.map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`torusUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}<p className='text-xs leading-6 text-slate-500'>{t(name === 'Torus' ? 'torusUI.torusHint' : 'torusUI.knotHint')}</p></section>
}
