import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, EnvironmentCube, EnvironmentMap, EnvironmentPortal, useEnvironment } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The six local images form a cube map with distinctive colored light panels.
const files = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map((face) => `${import.meta.env.BASE_URL}images/environment/${face}.svg`)

// The store controls background visibility, reflection intensity and surface roughness.
export const useEnvironmentStore = create((set) => ({ background: true, intensity: 1, roughness: 0.15, setValue: (key, value) => set({ [key]: value }), reset: () => set({ background: true, intensity: 1, roughness: 0.15 }) }))

// A locally loaded texture can be assigned to the scene or directly to one material.
function LoadedEnvironment ({ direct = false }) {
  const { background, intensity, roughness } = useEnvironmentStore()
  const texture = useEnvironment({ files })
  return <>{direct ? <>{background && <EnvironmentMap background='only' map={texture} />}<mesh><sphereGeometry args={[1.5, 48, 32]} /><meshStandardMaterial color='#ffffff' metalness={1} roughness={roughness} envMap={texture} envMapIntensity={intensity} /></mesh></> : <EnvironmentMap map={texture} background={background} environmentIntensity={intensity} />}</>
}

// The portal scene is captured by a cube camera and applied as a live environment.
function PortalEnvironment () {
  const { background, intensity } = useEnvironmentStore()
  return <EnvironmentPortal background={background} environmentIntensity={intensity} resolution={128} frames={1}><color attach='background' args={['#3730a3']} /><mesh position={[0, 1, -4]}><planeGeometry args={[5, 2]} /><meshBasicMaterial color='#ffffff' /></mesh><mesh position={[4, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[3, 3]} /><meshBasicMaterial color='#fbbf24' /></mesh><mesh position={[-4, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[3, 3]} /><meshBasicMaterial color='#a5f3fc' /></mesh></EnvironmentPortal>
}

// The scene chooses the requested environment component and displays a reflective sphere.
function EnvironmentScene () {
  const { name } = useParams()
  const { background, intensity, roughness } = useEnvironmentStore()
  const common = { background, environmentIntensity: intensity }
  return <><color attach='background' args={['#e0e7ff']} /><Suspense fallback={null}>{name === 'Environment' ? <Environment files={files} {...common} /> : name === 'EnvironmentCube' ? <EnvironmentCube files={files} {...common} /> : name === 'EnvironmentMap' ? <LoadedEnvironment /> : name === 'useEnvironment' ? <LoadedEnvironment direct /> : <PortalEnvironment />}{name !== 'useEnvironment' && <mesh><sphereGeometry args={[1.5, 48, 32]} /><meshStandardMaterial color='#ffffff' metalness={1} roughness={roughness} /></mesh>}</Suspense></>
}

// The canvas initializes environment controls when entering or leaving a lesson.
export default function EnvironmentDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useEnvironmentStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('environmentUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><EnvironmentScene /></Canvas></div>
}

// The panel switches the background independently of reflections and adjusts the material.
export function EnvironmentPanel () {
  const { t } = useTranslation()
  const state = useEnvironmentStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('environmentUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['intensity', 0, 2, 0.05], ['roughness', 0, 1, 0.05]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`environmentUI.${key}`)}</span><span className='font-mono'>{state[key].toFixed(2)}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Button aria-pressed={state.background} onClick={() => state.setValue('background', !state.background)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.background ? 'environmentUI.backgroundOn' : 'environmentUI.backgroundOff')}</Button><p className='text-xs leading-6 text-slate-500'>{t('environmentUI.hint')}</p></section>
}
