import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Extrude, Shape as DreiShape } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { DoubleSide, Path, Shape } from 'three'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares hole size, curve sampling, depth and surface settings.
export const useShapeExtrudeStore = create((set) => ({ hole: 0.45, curveSegments: 24, depth: 0.8, bevel: false, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ hole: 0.45, curveSegments: 24, depth: 0.8, bevel: false, wireframe: false }) }))

// The scene builds one rectangular contour with a circular hole for either geometry.
function ShapeExtrudeScene () {
  const { name } = useParams()
  const { hole, curveSegments, depth, bevel, wireframe } = useShapeExtrudeStore()
  const shape = useMemo(() => {
    const outline = new Shape()
    outline.moveTo(-1.3, -1)
    outline.lineTo(1.3, -1)
    outline.lineTo(1.3, 1)
    outline.lineTo(-1.3, 1)
    outline.closePath()
    const opening = new Path()
    opening.absarc(0, 0, hole, 0, Math.PI * 2, true)
    outline.holes.push(opening)
    return outline
  }, [hole])
  const options = useMemo(() => ({ depth, steps: 1, curveSegments, bevelEnabled: bevel, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 3 }), [depth, curveSegments, bevel])
  const material = <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} side={DoubleSide} />
  return <><ResponsiveFraming halfWidth={2.1} minimumDistance={7} frontDepth={1.5} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} />{name === 'Shape' ? <DreiShape args={[shape, curveSegments]}>{material}</DreiShape> : <Extrude args={[shape, options]} rotation={[-0.2, 0.45, 0]} position={[0, 0, -depth / 2]}>{material}</Extrude>}</>
}

// Each lesson begins with a fresh contour and extrusion configuration.
export default function ShapeExtrudeDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useShapeExtrudeStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('shapeExtrudeUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><ShapeExtrudeScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('shapeExtrudeUI.legend')}</span></div>
}

// The panel edits the hole and exposes extrusion-only depth and bevel settings.
export function ShapeExtrudePanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useShapeExtrudeStore()
  const fields = [['hole', 0.2, 0.7, 0.05], ['curveSegments', 3, 48, 1], ...(name === 'Extrude' ? [['depth', 0.2, 1.5, 0.1]] : [])]
  const switches = [...(name === 'Extrude' ? ['bevel'] : []), 'wireframe']
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('shapeExtrudeUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`shapeExtrudeUI.${key}`)}</span><span className='font-mono'>{key === 'curveSegments' ? state[key] : `${state[key].toFixed(2)} m`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{switches.map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`shapeExtrudeUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}<p className='text-xs leading-6 text-slate-500'>{t('shapeExtrudeUI.hint')}</p></section>
}
