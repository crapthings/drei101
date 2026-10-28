import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Decal, useTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the decal projector's position, scale and debug volume.
export const useDecalStore = create((set) => ({ x: 0, size: 1.1, debug: false, enabled: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ x: 0, size: 1.1, debug: false, enabled: true }) }))

// The model projects a local illustration onto a curved spherical surface.
function DecalModel () {
  const texture = useTexture(`${import.meta.env.BASE_URL}images/vector-demo.svg`)
  const { x, size, debug, enabled } = useDecalStore()
  // Remount so Drei initializes a newly enabled debug helper with the projector transform.
  return <mesh><sphereGeometry args={[1.35, 64, 48]} /><meshStandardMaterial color='#818cf8' roughness={0.55} />{enabled && <Decal key={String(debug)} map={texture} position={[x, 0, 1.25]} scale={[size, size * 0.6, 1]} debug={debug} />}</mesh>
}

// The canvas displays the decal on a lit surface and resets controls on navigation.
export default function DecalDemo () {
  const { t } = useTranslation()
  const reset = useDecalStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('decalUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2} minimumDistance={6} frontDepth={1.4} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-3, 1, 4]} intensity={0.8} /><Suspense fallback={null}><DecalModel /></Suspense></Canvas></div>
}

// The panel changes the projector and toggles its visual debug helper.
export function DecalPanel () {
  const { t } = useTranslation()
  const state = useDecalStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('decalUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['x', -0.8, 0.8, 0.05], ['size', 0.4, 2, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`decalUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{['enabled', 'debug'].map((key) => <Button key={key} aria-pressed={state[key]} onClick={() => state.setValue(key, !state[key])} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(`decalUI.${key}${state[key] ? 'On' : 'Off'}`)}</Button>)}</section>
}
