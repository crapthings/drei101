import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RenderCubeTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the captured object's horizontal position and cube texture resolution.
export const useCubeTextureStore = create((set) => ({ x: 0, resolution: 256, setValue: (key, value) => set({ [key]: value }), reset: () => set({ x: 0, resolution: 256 }) }))

// The capture scene places colored objects around the cube camera.
function CaptureScene () {
  const x = useCubeTextureStore((state) => state.x)
  return <><color attach='background' args={['#818cf8']} /><mesh position={[x, 1, 3]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshBasicMaterial color='#f59e0b' /></mesh><mesh position={[-3, -1, 1]}><sphereGeometry args={[1, 32, 24]} /><meshBasicMaterial color='#e0e7ff' /></mesh><mesh position={[3, 0, -2]}><boxGeometry args={[1.5, 3, 1.5]} /><meshBasicMaterial color='#312e81' /></mesh></>
}

// The main scene displays the captured cube texture as a metal sphere's environment map.
export default function RenderCubeTextureDemo () {
  const { t } = useTranslation()
  const { resolution, reset } = useCubeTextureStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('renderCubeUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2} minimumDistance={6} frontDepth={1.3} /><mesh><sphereGeometry args={[1.3, 64, 48]} /><meshStandardMaterial metalness={1} roughness={0.08}><RenderCubeTexture attach='envMap' resolution={resolution}><CaptureScene /></RenderCubeTexture></meshStandardMaterial></mesh><OrbitControls makeDefault minDistance={4} maxDistance={12} /></Canvas></div>
}

// The panel changes the captured object position and cube-face resolution.
export function RenderCubeTexturePanel () {
  const { t } = useTranslation()
  const state = useCubeTextureStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('renderCubeUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['x', -2, 2, 0.1], ['resolution', 64, 512, 64]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`renderCubeUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'x' ? ' m' : ' px'}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('renderCubeUI.hint')}</p></section>
}
