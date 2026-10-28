import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { RoundedBox, RoundedBoxGeometry } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares dimensions, corner radius, bevel subdivisions and wireframe state.
export const useRoundedBoxStore = create((set) => ({ width: 2, height: 1.5, depth: 1.2, radius: 0.2, bevelSegments: 4, wireframe: false, setValue: (key, value) => set({ [key]: value }), reset: () => set({ width: 2, height: 1.5, depth: 1.2, radius: 0.2, bevelSegments: 4, wireframe: false }) }))

// The scene contrasts the mesh wrapper with its separately attached geometry export.
function RoundedBoxScene () {
  const { name } = useParams()
  const { width, height, depth, radius, bevelSegments, wireframe } = useRoundedBoxStore()
  const material = <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={wireframe} />
  const args = [width, height, depth]
  return <><ResponsiveFraming halfWidth={2.6} minimumDistance={7} frontDepth={2} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} />{name === 'RoundedBox' ? <RoundedBox args={args} radius={radius} bevelSegments={bevelSegments} rotation={[-0.25, 0.55, 0]}>{material}</RoundedBox> : <mesh rotation={[-0.25, 0.55, 0]}><RoundedBoxGeometry args={args} radius={radius} bevelSegments={bevelSegments} />{material}</mesh>}</>
}

// Each route resets its dimensions and corner settings on entry and exit.
export default function RoundedBoxDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useRoundedBoxStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('roundedBoxUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><RoundedBoxScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('roundedBoxUI.legend')}</span></div>
}

// The panel controls dimensions, a bounded corner radius and edge subdivisions.
export function RoundedBoxPanel () {
  const { t } = useTranslation()
  const state = useRoundedBoxStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('roundedBoxUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['width', 1, 3, 0.1], ['height', 1, 3, 0.1], ['depth', 1, 3, 0.1], ['radius', 0.05, 0.45, 0.05], ['bevelSegments', 1, 8, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`roundedBoxUI.${key}`)}</span><span className='font-mono'>{key === 'bevelSegments' ? state[key] : `${state[key].toFixed(2)} m`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('roundedBoxUI.wireframe')}</Label><Switch checked={state.wireframe} onChange={(value) => state.setValue('wireframe', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('roundedBoxUI.hint')}</p></section>
}
