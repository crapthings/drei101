import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointMaterial, PointMaterialImpl } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the size and visibility of the round point comparison.
export const usePointMaterialStore = create((set) => ({ size: 28, enabled: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ size: 28, enabled: true }) }))

// The grid uses the same positions for the standard and antialiased point materials.
function PointGrid ({ x, round, size, implementation }) {
  const positions = useMemo(() => Float32Array.from(Array.from({ length: 49 }, (_, index) => [(index % 7 - 3) * 0.42, (3 - Math.floor(index / 7)) * 0.42, 0]).flat()), [])
  const material = useMemo(() => new PointMaterialImpl({ color: '#4f46e5', transparent: true, sizeAttenuation: false, depthWrite: false }), [])
  useEffect(() => () => material.dispose(), [material])
  return <points position={[x, 0, 0]}><bufferGeometry><bufferAttribute attach='attributes-position' args={[positions, 3]} /></bufferGeometry>{round ? implementation ? <primitive object={material} attach='material' size={size} /> : <PointMaterial color='#4f46e5' transparent size={size} sizeAttenuation={false} depthWrite={false} /> : <pointsMaterial color='#818cf8' size={size} sizeAttenuation={false} />}</points>
}

// The canvas compares ordinary square points and the selected circular implementation.
export default function PointMaterialDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { size, enabled, reset } = usePointMaterialStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('pointMaterialUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={4} minimumDistance={8} /><PointGrid x={-1.8} size={size} /><PointGrid x={1.8} size={size} round={enabled} implementation={name === 'PointMaterialImpl'} /></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('pointMaterialUI.standard')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('pointMaterialUI.round')}</span></div></div>
}

// The panel adjusts point size and toggles the circular shader.
export function PointMaterialPanel () {
  const { t } = useTranslation()
  const state = usePointMaterialStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('pointMaterialUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('pointMaterialUI.size')}</span><span className='font-mono'>{state.size}</span></span><input type='range' min='6' max='60' step='2' value={state.size} onChange={(event) => state.setValue('size', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'pointMaterialUI.on' : 'pointMaterialUI.off')}</Button></section>
}
