import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls the form, intensity and horizontal position of the reflection source.
export const useLightformerStore = create((set) => ({ form: 'rect', intensity: 4, x: 2, setValue: (key, value) => set({ [key]: value }), reset: () => set({ form: 'rect', intensity: 4, x: 2 }) }))

// The scene captures emissive shapes into an environment map reflected by a metal sphere.
function LightformerScene () {
  const { form, intensity, x } = useLightformerStore()
  return <><color attach='background' args={['#e0e7ff']} /><directionalLight position={[-3, 4, 5]} intensity={0.5} /><Environment key={`${form}-${intensity}-${x}`} frames={1} resolution={256}><Lightformer form={form} intensity={intensity} position={[x, 2, 4]} scale={[3, 2, 1]} target={[0, 0, 0]} /><Lightformer form='rect' intensity={1} position={[-4, 1, 1]} scale={[1, 4, 1]} target={[0, 0, 0]} /></Environment><mesh><sphereGeometry args={[1.4, 64, 48]} /><meshStandardMaterial color='#c7d2fe' metalness={1} roughness={0.16} /></mesh><OrbitControls makeDefault minDistance={4} maxDistance={12} /></>
}

// The canvas resets the reflection source when entering and leaving the lesson.
export default function LightformerDemo () {
  const { t } = useTranslation()
  const reset = useLightformerStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('lightformerUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}><LightformerScene /></Canvas></div>
}

// The panel adjusts the emissive form and the environment capture.
export function LightformerPanel () {
  const { t } = useTranslation()
  const state = useLightformerStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('lightformerUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><div className='space-y-2'><p className='text-xs text-slate-600'>{t('lightformerUI.form')}</p><div className='grid grid-cols-3 gap-2'>{['rect', 'circle', 'ring'].map((form) => <Button key={form} aria-pressed={state.form === form} onClick={() => state.setValue('form', form)} className={`cursor-pointer rounded-lg border px-2 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${state.form === form ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(`lightformerUI.${form}`)}</Button>)}</div></div>{[['intensity', 0, 10, 0.5], ['x', -4, 4, 0.5]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`lightformerUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('shadowBasicsUI.orbitHint')}</p></section>
}
