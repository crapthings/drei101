import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Polyhedron } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// Four triangular faces reference the four vertices of a tetrahedron.
const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1]

// The store shares one input coordinate, outer radius, subdivision and wireframe state.
export const usePolyhedronStore = create((set) => ({ vertexY: 1, radius: 1.5, detail: 0, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ vertexY: 1, radius: 1.5, detail: 0, wireframe: false }) }))

// The scene projects the indexed tetrahedron vertices onto the chosen sphere.
function PolyhedronScene () {
  const { vertexY, radius, detail, wireframe } = usePolyhedronStore()
  const vertices = useMemo(() => [1, vertexY, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1], [vertexY])
  return <><ResponsiveFraming halfWidth={2.2} minimumDistance={7} frontDepth={1.8} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Polyhedron args={[vertices, indices, radius, detail]} rotation={[-0.3, 0.5, 0]}><meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} /></Polyhedron></>
}

// The canvas resets the custom vertices and geometry settings on entry and exit.
export default function PolyhedronDemo () {
  const { t } = useTranslation()
  const reset = usePolyhedronStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('polyhedronUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><PolyhedronScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('polyhedronUI.legend')}</span></div>
}

// The panel adjusts one vertex direction, the projection radius and subdivision.
export function PolyhedronPanel () {
  const { t } = useTranslation()
  const state = usePolyhedronStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('polyhedronUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['vertexY', 0.2, 2.5, 0.1], ['radius', 0.5, 2, 0.1], ['detail', 0, 4, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`polyhedronUI.${key}`)}</span><span className='font-mono'>{key === 'detail' ? state[key] : `${state[key].toFixed(1)}${key === 'radius' ? ' m' : ''}`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('polyhedronUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('polyhedronUI.hint')}</p></section>
}
