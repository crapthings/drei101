import { useEffect, useMemo, useRef } from 'react'
import { Canvas, createPortal, useFrame } from '@react-three/fiber'
import { Fbo, useFBO } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { PerspectiveCamera, Scene } from 'three'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls offscreen resolution and rotation speed.
export const useFboStore = create((set) => ({ resolution: 256, speed: 1, setValue: (key, value) => set({ [key]: value }), reset: () => set({ resolution: 256, speed: 1 }) }))

// The capture renders a separate scene into the supplied target before the main frame.
function Capture ({ target }) {
  const speed = useFboStore((state) => state.speed)
  const scene = useMemo(() => new Scene(), [])
  const camera = useMemo(() => { const result = new PerspectiveCamera(50, 1, 0.1, 100); result.position.set(0, 0, 5); return result }, [])
  const mesh = useRef(null)
  useFrame(({ gl }, delta) => { if (mesh.current) mesh.current.rotation.y += delta * speed; const previous = gl.getRenderTarget(); gl.setRenderTarget(target); gl.render(scene, camera); gl.setRenderTarget(previous) }, -1)
  return <>{createPortal(<><color attach='background' args={['#c7d2fe']} /><mesh ref={mesh}><torusKnotGeometry args={[0.8, 0.25, 128, 24]} /><meshNormalMaterial /></mesh></>, scene)}<mesh><planeGeometry args={[3.5, 3.5]} /><meshBasicMaterial map={target.texture} toneMapped={false} /></mesh></>
}

// The hook variant creates the render target directly inside the canvas.
function HookTarget () {
  const resolution = useFboStore((state) => state.resolution)
  const target = useFBO(resolution, resolution)
  return <Capture target={target} />
}

// The canvas chooses the actual Fbo component or useFBO hook for its target.
export default function FboDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { resolution, reset } = useFboStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('fboUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.2} minimumDistance={6} frontDepth={0} />{name === 'Fbo' ? <Fbo width={resolution} height={resolution}>{(target) => <Capture target={target} />}</Fbo> : <HookTarget />}</Canvas></div>
}

// The panel adjusts target dimensions and the captured object's motion.
export function FboPanel () {
  const { t } = useTranslation()
  const state = useFboStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('fboUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['resolution', 64, 512, 64], ['speed', 0, 3, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`fboUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'resolution' ? ' × ' + state[key] + ' px' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}</section>
}
