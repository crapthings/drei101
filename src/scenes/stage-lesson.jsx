import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls the stage lighting preset, intensity and contact shadow.
export const useStageStore = create((set) => ({ preset: 'rembrandt', intensity: 1, shadows: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ preset: 'rembrandt', intensity: 1, shadows: true }) }))

// The stage centers the model and provides its built-in studio lights and shadow.
function StageScene () {
  const { preset, intensity, shadows } = useStageStore()
  return <><color attach='background' args={['#eef2ff']} /><Stage environment={null} adjustCamera={false} shadows={shadows ? 'contact' : false} preset={preset} intensity={intensity}><mesh castShadow><torusKnotGeometry args={[0.75, 0.24, 128, 24]} /><meshStandardMaterial color='#6366f1' metalness={0.2} roughness={0.35} /></mesh></Stage><OrbitControls makeDefault minDistance={3} maxDistance={15} /></>
}

// The canvas resets stage settings and enables shadows for the stage lights.
export default function StageDemo () {
  const { t } = useTranslation()
  const reset = useStageStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('stageUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas shadows camera={{ position: [4, 3, 7], fov: 45 }} dpr={[1, 2]}><StageScene /></Canvas></div>
}

// The panel switches studio presets, stage intensity and contact shadows.
export function StagePanel () {
  const { t } = useTranslation()
  const state = useStageStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('stageUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><div className='space-y-2'><p className='text-xs text-slate-600'>{t('stageUI.preset')}</p><div className='grid grid-cols-2 gap-2'>{['rembrandt', 'portrait', 'upfront', 'soft'].map((preset) => <Button key={preset} aria-pressed={state.preset === preset} onClick={() => state.setValue('preset', preset)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${state.preset === preset ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{preset}</Button>)}</div></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('stageUI.intensity')}</span><span className='font-mono'>{state.intensity}</span></span><input type='range' min='0' max='2' step='0.1' value={state.intensity} onChange={(event) => state.setValue('intensity', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><Button aria-pressed={state.shadows} onClick={() => state.setValue('shadows', !state.shadows)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.shadows ? 'stageUI.shadowOn' : 'stageUI.shadowOff')}</Button><p className='text-xs leading-6 text-slate-500'>{t('shadowBasicsUI.orbitHint')}</p></section>
}
