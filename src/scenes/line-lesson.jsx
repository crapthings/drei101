import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// Four fixed points make the difference between a polyline and paired segments visible.
const points = [[-3, -1, 0], [-1, 1, 0], [1, -1, 0], [3, 1, 0]]

// The lesson store shares line topology, style and width settings.
export const useLineStore = create((set) => ({ segments: false, dashed: false, width: 4, setValue: (key, value) => set({ [key]: value }), reset: () => set({ segments: false, dashed: false, width: 4 }) }))

// The scene shows the line and the points used to construct it.
function LineScene () {
  const { segments, dashed, width } = useLineStore()
  return <><ResponsiveFraming halfWidth={3.4} minimumDistance={8} frontDepth={0.15} /><color attach='background' args={['#eef2ff']} /><Line key={String(segments)} points={points} segments={segments} dashed={dashed} dashSize={0.35} gapSize={0.2} color='#4f46e5' lineWidth={width} />{points.map((point, index) => <mesh key={index} position={point}><sphereGeometry args={[0.09, 16, 16]} /><meshBasicMaterial color='#f59e0b' /></mesh>)}</>
}

// The canvas resets its settings when the lesson is entered or left.
export default function LineDemo () {
  const { t } = useTranslation()
  const reset = useLineStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('lineUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><LineScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('lineUI.legend')}</span></div>
}

// The panel controls topology, dash styling and screen-space width.
export function LinePanel () {
  const { t } = useTranslation()
  const state = useLineStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('lineUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{['segments', 'dashed'].map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`lineUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}<label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('lineUI.width')}</span><span className='font-mono'>{state.width} px</span></span><input type='range' min='1' max='12' step='1' value={state.width} onChange={(event) => state.setValue('width', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><p className='text-xs leading-6 text-slate-500'>{t('lineUI.hint')}</p></section>
}
