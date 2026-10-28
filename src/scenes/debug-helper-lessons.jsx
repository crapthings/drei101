import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, Helper, OrbitControls, useHelper } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DirectionalLightHelper } from 'three'

// The store controls grid spacing and the position of the inspected light.
export const useDebugHelperStore = create((set) => ({ spacing: 1, lightX: 3, visible: true, revision: 0, setValue: (key, value) => set({ [key]: value }), reset: () => set((state) => ({ spacing: 1, lightX: 3, visible: true, revision: state.revision + 1 })) }))

// The hook attaches a Three.js helper to the referenced light when enabled.
function HookLight () {
  const { lightX, visible } = useDebugHelperStore()
  const light = useRef()
  useHelper(visible && light, DirectionalLightHelper, 0.8, '#f97316')
  return <directionalLight ref={light} position={[lightX, 4, 3]} intensity={3} />
}

// The component attaches the same helper to its parent light.
function ComponentLight () {
  const { lightX, visible } = useDebugHelperStore()
  return <directionalLight position={[lightX, 4, 3]} intensity={3}>{visible && <Helper type={DirectionalLightHelper} args={[0.8, '#f97316']} />}</directionalLight>
}

// The scene displays either the shader grid or the inspected directional light.
export default function DebugHelperDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { spacing, revision, reset } = useDebugHelperStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('debugHelperUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas key={revision} camera={{ position: [6, 5, 8], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} />{name === 'Helper' ? <ComponentLight /> : name === 'useHelper' ? <HookLight /> : <directionalLight position={[3, 4, 3]} intensity={3} />}<directionalLight position={[-3, 2, -3]} intensity={0.8} /><mesh position={[0, 0.75, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color='#818cf8' /></mesh>{name === 'Grid' ? <Grid args={[12, 12]} cellSize={spacing} sectionSize={spacing * 5} cellColor='#a5b4fc' sectionColor='#4f46e5' fadeDistance={20} fadeStrength={1} /> : <gridHelper args={[10, 10, '#a5b4fc', '#c7d2fe']} />}<OrbitControls makeDefault target={[0, 1, 0]} /></Canvas></div>
}

// The panel adjusts grid spacing or moves and toggles the light helper.
export function DebugHelperPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useDebugHelperStore()
  const grid = name === 'Grid'
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('debugHelperUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(grid ? 'debugHelperUI.spacing' : 'debugHelperUI.lightX')}</span><span>{grid ? state.spacing : state.lightX} m</span></span><input type='range' min={grid ? 0.25 : -4} max={grid ? 2 : 4} step={grid ? 0.25 : 0.5} value={grid ? state.spacing : state.lightX} onChange={(event) => state.setValue(grid ? 'spacing' : 'lightX', Number(event.target.value))} className='w-full accent-indigo-600' /></label>{!grid && <Button aria-pressed={state.visible} onClick={() => state.setValue('visible', !state.visible)} className='w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(state.visible ? 'debugHelperUI.on' : 'debugHelperUI.off')}</Button>}<p className='text-xs leading-6 text-slate-500'>{t('debugHelperUI.hint')}</p></section>
}
