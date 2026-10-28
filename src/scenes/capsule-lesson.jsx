import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Capsule } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares capsule dimensions, subdivision counts and wireframe visibility.
export const useCapsuleStore = create((set) => ({ radius: 0.7, length: 1.4, capSegments: 4, radialSegments: 12, heightSegments: 1, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ radius: 0.7, length: 1.4, capSegments: 4, radialSegments: 12, heightSegments: 1, wireframe: false }) }))

// The scene displays a capsule with independently adjustable dimensions and subdivisions.
function CapsuleScene () {
  const { radius, length, capSegments, radialSegments, heightSegments, wireframe } = useCapsuleStore()
  return <><ResponsiveFraming halfWidth={2.2} minimumDistance={8} frontDepth={1.5} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Capsule args={[radius, length, capSegments, radialSegments, heightSegments]} rotation={[0, 0, 0.2]}><meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} /></Capsule></>
}

// The canvas resets capsule settings when the lesson is entered or left.
export default function CapsuleDemo () {
  const { t } = useTranslation()
  const reset = useCapsuleStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('capsuleUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><CapsuleScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('capsuleUI.legend')}</span></div>
}

// The panel adjusts the radius, center length and surface subdivisions.
export function CapsulePanel () {
  const { t } = useTranslation()
  const state = useCapsuleStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('capsuleUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['radius', 0.3, 1.2, 0.1], ['length', 0, 2, 0.1], ['capSegments', 1, 12, 1], ['radialSegments', 3, 32, 1], ['heightSegments', 1, 8, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`capsuleUI.${key}`)}</span><span className='font-mono'>{key === 'radius' || key === 'length' ? `${state[key].toFixed(1)} m` : state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('capsuleUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900'>{t('capsuleUI.totalHeight', { height: (state.length + 2 * state.radius).toFixed(1) })}</p></section>
}
