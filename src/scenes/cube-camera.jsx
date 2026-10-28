import { useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CubeCamera, OrbitControls, useCubeCamera } from '@react-three/drei'
import { Button, Field, Input, Label } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

// Capture settings distinguish continuous reflections from intentionally frozen snapshots.
export const useCaptureStore = create((set) => ({
  live: true,
  roughness: 0.05,
  resolution: 128,
  capture: 0,
  setParameter: (name, value) => set({ [name]: value }),
  takeSnapshot: () => set((state) => ({ capture: state.capture + 1 })),
  reset: () => set((state) => ({ live: true, roughness: 0.05, resolution: 128, capture: state.capture + 1 }))
}))

// A moving emissive-looking cube makes live and frozen reflection differences observable.
function MovingMarker () {
  const marker = useRef(null)
  useFrame(({ clock }) => {
    const angle = clock.elapsedTime * 0.65
    marker.current.position.set(Math.cos(angle) * 3, 1.2, Math.sin(angle) * 3)
    marker.current.rotation.y = angle
  })
  return <mesh ref={marker}><boxGeometry args={[0.9, 0.9, 0.9]} /><meshBasicMaterial color='#e879f9' /></mesh>
}

// The hook caller owns capture timing and excludes the reflective object during rendering.
function HookReflector () {
  const sphere = useRef(null)
  const lastCapture = useRef(-1)
  const live = useCaptureStore((state) => state.live)
  const capture = useCaptureStore((state) => state.capture)
  const roughness = useCaptureStore((state) => state.roughness)
  const resolution = useCaptureStore((state) => state.resolution)
  const { fbo, camera, update } = useCubeCamera({ resolution, near: 0.1, far: 40 })

  useLayoutEffect(() => {
    camera.position.set(0, 1, 0)
    lastCapture.current = -1
  }, [camera])

  useFrame(() => {
    if (!live && lastCapture.current === capture) return
    const visible = sphere.current.visible
    sphere.current.visible = false
    try {
      update()
      lastCapture.current = capture
    } finally {
      sphere.current.visible = visible
    }
  })

  return <mesh ref={sphere} position={[0, 1, 0]}><sphereGeometry args={[1, 48, 32]} /><meshStandardMaterial envMap={fbo.texture} metalness={1} roughness={roughness} /></mesh>
}

// Material changes remain independent of capture timing so frozen reflections stay frozen.
function ReflectiveSphere ({ texture }) {
  const roughness = useCaptureStore((state) => state.roughness)
  return <mesh><sphereGeometry args={[1, 48, 32]} /><meshStandardMaterial envMap={texture} metalness={1} roughness={roughness} /></mesh>
}

// The component hides its render-prop children automatically while capturing six directions.
function ComponentReflector () {
  const live = useCaptureStore((state) => state.live)
  const capture = useCaptureStore((state) => state.capture)
  const resolution = useCaptureStore((state) => state.resolution)
  return <CubeCamera key={`${live}-${capture}-${resolution}`} position={[0, 1, 0]} resolution={resolution} near={0.1} far={40} frames={live ? Infinity : 1}>{(texture) => <ReflectiveSphere texture={texture} />}</CubeCamera>
}

// Surrounding unlit markers provide a self-contained environment without downloaded assets.
function ReflectionScene ({ hook }) {
  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <directionalLight position={[3, 6, 4]} intensity={2} />
      <MovingMarker />
      {[[-3, '#6366f1'], [3, '#38bdf8']].map(([x, color]) => <mesh key={x} position={[x, 1.5, -3]}><boxGeometry args={[1.4, 3, 1.4]} /><meshBasicMaterial color={color} /></mesh>)}
      <mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[30, 30]} /><meshBasicMaterial color='#c7d2fe' /></mesh>
      <gridHelper args={[30, 30, '#818cf8', '#a5b4fc']} />
      {hook ? <HookReflector /> : <ComponentReflector />}
      <OrbitControls makeDefault target={[0, 1, 0]} minDistance={3} maxDistance={15} maxPolarAngle={Math.PI / 2} />
    </>
  )
}

// The same capture controls let readers compare declarative and imperative implementations.
export function CapturePanel () {
  const { t } = useTranslation()
  const state = useCaptureStore()
  return (
    <section className='space-y-6 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-sm font-medium'>{t('captureControls.title')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <div className='flex gap-2'>{[true, false].map((value) => <Button key={String(value)} aria-pressed={state.live === value} onClick={() => state.setParameter('live', value)} className={`flex-1 cursor-pointer rounded-lg border px-2 py-2 text-xs focus-visible:outline-2 ${state.live === value ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(value ? 'captureControls.live' : 'captureControls.frozen')}</Button>)}</div>
      <Button disabled={state.live} onClick={state.takeSnapshot} className='w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white disabled:cursor-default disabled:bg-slate-100 disabled:text-slate-400 focus-visible:outline-2'>{t('captureControls.snapshot')}</Button>
      <Field><div className='mb-3 flex justify-between text-xs'><Label>{t('captureControls.roughness')}</Label><output className='font-mono text-indigo-600'>{state.roughness.toFixed(2)}</output></div><Input type='range' min={0} max={0.8} step={0.01} value={state.roughness} onChange={(event) => state.setParameter('roughness', Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 focus-visible:outline-2' /></Field>
      <p className='text-xs text-slate-600'>{t('captureControls.resolution')}</p><div className='flex gap-2'>{[64, 128, 256].map((resolution) => <Button key={resolution} aria-pressed={state.resolution === resolution} onClick={() => state.setParameter('resolution', resolution)} className={`flex-1 cursor-pointer rounded-lg border px-2 py-2 font-mono text-xs focus-visible:outline-2 ${state.resolution === resolution ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{resolution}</Button>)}</div>
      <p className='text-xs leading-6 text-slate-500'>{t('captureControls.hint')}</p>
    </section>
  )
}

// The component-based example captures a local scene into a reflective sphere.
export default function CubeDemo () {
  const { t } = useTranslation()
  return <div role='img' aria-label={t('captureControls.label')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [5, 3, 6], fov: 45 }} dpr={[1, 2]}><ReflectionScene /></Canvas></div>
}

// The hook example uses the same scene while explicitly owning the capture lifecycle.
export function CubeHookDemo () {
  const { t } = useTranslation()
  return <div role='img' aria-label={t('captureControls.label')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [5, 3, 6], fov: 45 }} dpr={[1, 2]}><ReflectionScene hook /></Canvas></div>
}
