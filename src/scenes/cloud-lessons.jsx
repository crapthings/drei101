import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Cloud, CloudInstance, Clouds } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MeshBasicMaterial } from 'three'

// The store shares cloud segment, volume and motion settings with each experiment.
export const useCloudStore = create((set) => ({ segments: 24, volume: 2.5, speed: 0.2, opacity: 0.75, setValue: (key, value) => set({ [key]: value }), reset: () => set({ segments: 24, volume: 2.5, speed: 0.2, opacity: 0.75 }) }))

// The scene groups two independently seeded clouds in one instanced provider.
function CloudScene () {
  const { name } = useParams()
  const { segments, volume, speed, opacity } = useCloudStore()
  const Item = name === 'CloudInstance' ? CloudInstance : Cloud
  return <><color attach='background' args={['#6f8dc3']} /><Suspense fallback={null}><Clouds texture={`${import.meta.env.BASE_URL}images/cloud-puff.svg`} material={MeshBasicMaterial} limit={120}><Item seed={1} position={[-1.6, 0, 0]} bounds={[1.5, 0.5, 0.5]} segments={segments} volume={volume} speed={speed} opacity={opacity} growth={0.6} fade={0} color='#ffffff' /><Item seed={2} position={[1.7, 0.5, -1]} bounds={[1.2, 0.5, 0.5]} segments={segments} volume={volume} speed={speed} opacity={opacity} growth={0.6} fade={0} color='#e0e7ff' /></Clouds></Suspense></>
}

// The canvas resets cloud controls when changing lessons.
export default function CloudDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useCloudStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('cloudUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}><CloudScene /></Canvas></div>
}

// The panel adjusts the appearance of both clouds and preserves their random seeds.
export function CloudPanel () {
  const { t } = useTranslation()
  const state = useCloudStore()
  const fields = [['segments', 4, 50, 1], ['volume', 0.5, 5, 0.1], ['speed', 0, 2, 0.1], ['opacity', 0.1, 1, 0.05]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('cloudUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`cloudUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('cloudUI.hint')}</p></section>
}
