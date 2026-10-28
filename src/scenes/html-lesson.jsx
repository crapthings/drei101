import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares label position, occluder position and raycast occlusion settings.
export const useHtmlStore = create((set) => ({ anchorX: 0, depth: -1, blockerX: 1.5, occlude: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ anchorX: 0, depth: -1, blockerX: 1.5, occlude: true }) }))

// The scene anchors a DOM label to a marker and optionally tests it against a foreground box.
function HtmlScene () {
  const { t } = useTranslation()
  const { anchorX, depth, blockerX, occlude } = useHtmlStore()
  const blocker = useRef(null)
  const [ready, setReady] = useState(false)
  useFrame(() => { blocker.current?.updateWorldMatrix(true, false); if (!ready) setReady(true) }, -1)
  return <><ResponsiveFraming halfWidth={2.8} minimumDistance={7} frontDepth={1} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><mesh position={[anchorX, 0, depth]}><sphereGeometry args={[0.12, 16, 16]} /><meshBasicMaterial color='#f59e0b' /></mesh><mesh ref={blocker} position={[blockerX, 0, 0.5]}><boxGeometry args={[1, 1.4, 0.4]} /><meshStandardMaterial color='#6366f1' /></mesh>{ready && <Html position={[anchorX, 0, depth]} transform sprite distanceFactor={6} occlude={occlude ? [blocker] : undefined} pointerEvents='none'><div className='whitespace-nowrap rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-medium text-indigo-700 shadow-md'>{t('htmlUI.label')}</div></Html>}</>
}

// The demo resets positions and occlusion on entry and exit.
export default function HtmlDemo () {
  const { t } = useTranslation()
  const reset = useHtmlStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('htmlUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><HtmlScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('htmlUI.legend')}</span></div>
}

// The panel moves the DOM anchor and occluder and toggles raycast occlusion.
export function HtmlPanel () {
  const { t } = useTranslation()
  const state = useHtmlStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('htmlUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['anchorX', -2, 2, 0.1], ['depth', -2, 0, 0.1], ['blockerX', -2, 2, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`htmlUI.${key}`)}</span><span className='font-mono'>{state[key].toFixed(1)} m</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('htmlUI.occlude')}</Label><Switch checked={state.occlude} onChange={(value) => state.setValue('occlude', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><p className='text-xs leading-6 text-slate-500'>{t('htmlUI.hint')}</p></section>
}
