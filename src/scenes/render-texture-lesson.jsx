import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, RenderTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the animation and resolution of the offscreen scene.
export const useRenderTextureStore = create((set) => ({ speed: 1, resolution: 256, setValue: (key, value) => set({ [key]: value }), reset: () => set({ speed: 1, resolution: 256 }) }))

// The animated object is rendered only inside the texture's separate scene.
function TextureContent () {
  const mesh = useRef(null)
  const speed = useRenderTextureStore((state) => state.speed)
  useFrame((state, delta) => { if (mesh.current) mesh.current.rotation.y += delta * speed })
  return <><color attach='background' args={['#c7d2fe']} /><PerspectiveCamera makeDefault manual aspect={1} position={[0, 0, 5]} /><directionalLight position={[3, 4, 5]} intensity={3} /><mesh ref={mesh}><torusKnotGeometry args={[0.9, 0.3, 128, 24]} /><meshStandardMaterial color='#4f46e5' roughness={0.3} /></mesh></>
}

// The canvas displays the rendered scene as a material map on a visible panel.
export default function RenderTextureDemo () {
  const { t } = useTranslation()
  const { resolution, reset } = useRenderTextureStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('renderTextureUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.2} minimumDistance={6} frontDepth={0} /><mesh><planeGeometry args={[3.6, 3.6]} /><meshBasicMaterial toneMapped={false}><RenderTexture attach='map' width={resolution} height={resolution} samples={0}><TextureContent /></RenderTexture></meshBasicMaterial></mesh></Canvas></div>
}

// The panel changes the offscreen object's motion and target dimensions.
export function RenderTexturePanel () {
  const { t } = useTranslation()
  const state = useRenderTextureStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('renderTextureUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['speed', 0, 3, 0.1], ['resolution', 64, 512, 64]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`renderTextureUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'resolution' ? ' × ' + state[key] : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('renderTextureUI.hint')}</p></section>
}
