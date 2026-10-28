import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { MarchingCube, MarchingCubes, MarchingPlane } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares field strength, source separation, resolution and plane visibility.
export const useMarchingStore = create((set) => ({ distance: 0.8, strength: 0.5, resolution: 28, plane: false, setValue: (key, value) => set({ [key]: value }), reset: (name) => set({ distance: 0.8, strength: 0.5, resolution: 28, plane: name === 'MarchingPlane' }) }))

// The field combines two ball sources with an optional Y plane inside a two-meter cube.
function MarchingScene () {
  const { distance, strength, resolution, plane } = useMarchingStore()
  const field = useRef(null)
  useEffect(() => {
    const geometry = field.current?.geometry
    return () => geometry?.dispose()
  }, [resolution])
  return <><ResponsiveFraming halfWidth={1.35} minimumDistance={5} frontDepth={1} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={1} /><MarchingCubes key={resolution} ref={field} resolution={resolution} maxPolyCount={30000}><meshStandardMaterial color='#6366f1' roughness={0.32} metalness={0.05} /><MarchingCube position={[-distance / 2, 0, 0]} strength={strength} subtract={12} /><MarchingCube position={[distance / 2, 0, 0]} strength={strength} subtract={12} />{plane && <MarchingPlane planeType='y' strength={0.5} subtract={12} />}</MarchingCubes></>
}

// Each lesson resets the experiment when changing routes.
export default function MarchingDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useMarchingStore((state) => state.reset)
  useEffect(() => { reset(name); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('marchingUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}><MarchingScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('marchingUI.legend')}</span></div>
}

// The panel changes field source strength, spacing, resolution and the plane source.
export function MarchingPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useMarchingStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('marchingUI.panel')}</h3><Button onClick={() => state.reset(name)} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['distance', 0, 1.4, 0.05], ['strength', 0.2, 1, 0.05], ['resolution', 20, 48, 4]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`marchingUI.${key}`)}</span><span className='font-mono'>{key === 'resolution' ? state[key] : state[key].toFixed(2)}{key === 'distance' ? ' m' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('marchingUI.plane')}</Label><Switch checked={state.plane} onChange={(value) => state.setValue('plane', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('marchingUI.hint')}</p></section>
}
