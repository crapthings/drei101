import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { MeshRefractionMaterial, useCubeTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The six local images form the environment sampled by both comparison materials.
const files = ['px.svg', 'nx.svg', 'py.svg', 'ny.svg', 'pz.svg', 'nz.svg']

// The store controls refraction index, ray bounces and chromatic aberration.
export const useRefractionStore = create((set) => ({ enabled: true, ior: 2.4, bounces: 2, aberration: 0.03, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, ior: 2.4, bounces: 2, aberration: 0.03 }) }))

// The comparison uses one cube map for an ordinary reflective mesh and a refractive mesh.
function RefractionModels () {
  const envMap = useCubeTexture(files, { path: `${import.meta.env.BASE_URL}images/environment/` })
  const { enabled, ior, bounces, aberration } = useRefractionStore()
  return <><mesh position={[-1.7, 0, 0]} rotation={[0.25, 0.35, 0]}><icosahedronGeometry args={[1.2, 1]} /><meshStandardMaterial color='#ffffff' metalness={1} roughness={0.08} envMap={envMap} /></mesh><mesh position={[1.7, 0, 0]} rotation={[0.25, 0.35, 0]}><icosahedronGeometry args={[1.2, 1]} />{enabled ? <MeshRefractionMaterial envMap={envMap} ior={ior} bounces={bounces} aberrationStrength={aberration} fastChroma /> : <meshStandardMaterial color='#ffffff' metalness={1} roughness={0.08} envMap={envMap} />}</mesh></>
}

// The canvas resets the controls and waits for the six environment images.
export default function RefractionDemo () {
  const { t } = useTranslation()
  const reset = useRefractionStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('refractionUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.7} minimumDistance={8} frontDepth={1.2} /><directionalLight position={[3, 5, 6]} intensity={1} /><Suspense fallback={null}><RefractionModels /></Suspense></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('refractionUI.reference')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('refractionUI.effect')}</span></div></div>
}

// The panel adjusts optical parameters and toggles the refractive material.
export function RefractionPanel () {
  const { t } = useTranslation()
  const state = useRefractionStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('refractionUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['ior', 1.05, 3, 0.05], ['bounces', 1, 6, 1], ['aberration', 0.01, 0.2, 0.01]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`refractionUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'refractionUI.on' : 'refractionUI.off')}</Button></section>
}
