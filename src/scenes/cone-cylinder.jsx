import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Cone, Cylinder } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { DoubleSide } from 'three'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The shared store holds cone and cylinder dimensions, segments and end-cap settings.
export const useConeCylinderStore = create((set) => ({ top: 0.8, bottom: 1.1, height: 2, radial: 24, vertical: 1, sweep: 360, open: false, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ top: 0.8, bottom: 1.1, height: 2, radial: 24, vertical: 1, sweep: 360, open: false, wireframe: false }) }))

// The scene renders the selected shape with a view of its upper end.
function ConeCylinderScene () {
  const { name } = useParams()
  const { top, bottom, height, radial, vertical, sweep, open, wireframe } = useConeCylinderStore()
  const material = <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} side={DoubleSide} />
  return <><ResponsiveFraming halfWidth={2.2} minimumDistance={7} frontDepth={1.5} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} />{name === 'Cone' ? <Cone args={[bottom, height, radial, vertical, open, 0, sweep * Math.PI / 180]} rotation={[-0.3, 0.45, 0]}>{material}</Cone> : <Cylinder args={[top, bottom, height, radial, vertical, open, 0, sweep * Math.PI / 180]} rotation={[-0.3, 0.45, 0]}>{material}</Cylinder>}</>
}

// Each route starts with fresh dimensions and segment settings.
export default function ConeCylinderDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useConeCylinderStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('coneCylinderUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><ConeCylinderScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('coneCylinderUI.legend')}</span></div>
}

// The panel exposes dimensions, subdivisions, angular sweep and end caps.
export function ConeCylinderPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useConeCylinderStore()
  const fields = [...(name === 'Cylinder' ? [['top', 0, 1.5, 0.1]] : []), ['bottom', 0.2, 1.5, 0.1], ['height', 0.5, 3, 0.1], ['radial', 3, 48, 1], ['vertical', 1, 8, 1], ['sweep', 30, 360, 5]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('coneCylinderUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`coneCylinderUI.${key}`)}</span><span className='font-mono'>{['top', 'bottom', 'height'].includes(key) ? `${state[key].toFixed(1)} m` : `${state[key]}${key === 'sweep' ? '°' : ''}`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{['open', 'wireframe'].map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`coneCylinderUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}<p className='text-xs leading-6 text-slate-500'>{t('coneCylinderUI.hint')}</p></section>
}
