import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AsciiRenderer } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the ASCII output and character sampling resolution.
export const useAsciiStore = create((set) => ({ enabled: true, resolution: 0.15, speed: 0.6, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, resolution: 0.15, speed: 0.6 }) }))

// The spinning object provides changing light and silhouette for ASCII sampling.
function Subject () {
  const mesh = useRef(null)
  const speed = useAsciiStore((state) => state.speed)
  useFrame((state, delta) => { if (mesh.current) mesh.current.rotation.y += delta * speed })
  return <mesh ref={mesh}><torusKnotGeometry args={[1, 0.3, 128, 24]} /><meshStandardMaterial color='#a5b4fc' roughness={0.4} /></mesh>
}

// The canvas replaces its normal image with Drei's ASCII overlay when enabled.
export default function AsciiDemo () {
  const { t } = useTranslation()
  const { enabled, resolution, reset } = useAsciiStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('asciiUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={[enabled ? '#000000' : '#eef2ff']} /><ResponsiveFraming halfWidth={2.1} minimumDistance={6} frontDepth={1.3} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, 1, 2]} intensity={0.7} /><Subject />{enabled && <AsciiRenderer key={resolution} resolution={resolution} fgColor='#4338ca' bgColor='#eef2ff' />}</Canvas></div>
}

// The panel switches output mode and adjusts sampling and rotation.
export function AsciiPanel () {
  const { t } = useTranslation()
  const state = useAsciiStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('asciiUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'asciiUI.on' : 'asciiUI.off')}</Button>{[['resolution', 0.05, 0.3, 0.05], ['speed', 0, 2, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`asciiUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} disabled={key === 'resolution' && !state.enabled} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-40' /></label>)}</section>
}
