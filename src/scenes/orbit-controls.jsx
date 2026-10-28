import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MapControls, OrbitControls } from '@react-three/drei'
import { Button, Field, Input, Label, Switch } from '@headlessui/react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

// Each control starts with its documented interaction mapping and an explicit teaching configuration.
const defaults = {
  MapControls: { enablePan: true, enableRotate: true, enableZoom: true, enableDamping: true, screenSpacePanning: false, dampingFactor: 0.1, maxDistance: 30, maxPolar: 85, revision: 0 },
  OrbitControls: { enablePan: true, enableRotate: true, enableZoom: true, enableDamping: true, screenSpacePanning: true, dampingFactor: 0.1, maxDistance: 30, maxPolar: 85, revision: 0 }
}

// Separate settings and sampled readings prevent telemetry from resetting active camera gestures.
export const useOrbitDemoStore = create((set) => ({
  settings: { MapControls: { ...defaults.MapControls }, OrbitControls: { ...defaults.OrbitControls } },
  readings: {},
  setParameter: (name, key, value) => set((state) => ({ settings: { ...state.settings, [name]: { ...state.settings[name], [key]: value } } })),
  reset: (name) => set((state) => ({ settings: { ...state.settings, [name]: { ...defaults[name], revision: state.settings[name].revision + 1 } } }))
}))

// A ref-bound rig exposes actual camera and target values after the controls have updated.
function OrbitRig ({ name }) {
  const ref = useRef(null)
  const marker = useRef(null)
  const lastSample = useRef(0)
  const camera = useThree((state) => state.camera)
  const settings = useOrbitDemoStore((state) => state.settings[name])
  const Control = name === 'MapControls' ? MapControls : OrbitControls

  useEffect(() => {
    camera.position.set(8, 9, 10)
    camera.up.set(0, 1, 0)
    ref.current.target.set(0, 0, 0)
    ref.current.update()
  }, [camera])

  useFrame(({ clock }) => {
    if (!ref.current) return
    marker.current.position.copy(ref.current.target)
    if (clock.elapsedTime - lastSample.current < 0.15) return
    lastSample.current = clock.elapsedTime
    const reading = {
      position: camera.position.toArray().map((value) => Number(value.toFixed(2))),
      target: ref.current.target.toArray().map((value) => Number(value.toFixed(2))),
      distance: camera.position.distanceTo(ref.current.target).toFixed(2),
      polar: (ref.current.getPolarAngle() * 180 / Math.PI).toFixed(1)
    }
    useOrbitDemoStore.setState((state) => ({ readings: { ...state.readings, [name]: reading } }))
  })

  return (
    <>
      <Control ref={ref} makeDefault enablePan={settings.enablePan} enableRotate={settings.enableRotate} enableZoom={settings.enableZoom} enableDamping={settings.enableDamping} dampingFactor={settings.dampingFactor} screenSpacePanning={settings.screenSpacePanning} minDistance={4} maxDistance={settings.maxDistance} minPolarAngle={0.1} maxPolarAngle={settings.maxPolar * Math.PI / 180} />
      <mesh ref={marker} renderOrder={10}><sphereGeometry args={[0.12, 16, 12]} /><meshBasicMaterial color='#f59e0b' depthTest={false} /></mesh>
    </>
  )
}

// A small city grid gives panning, orbiting and distance limits distinct visual references.
function OrbitScene ({ name }) {
  const revision = useOrbitDemoStore((state) => state.settings[name].revision)
  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <directionalLight position={[6, 12, 8]} intensity={3} />
      <directionalLight position={[-6, 4, -3]} intensity={1} color='#c7d2fe' />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]}><planeGeometry args={[60, 60]} /><meshBasicMaterial color='#e0e7ff' /></mesh>
      <gridHelper args={[60, 60, '#818cf8', '#c7d2fe']} />
      {Array.from({ length: 25 }, (_, index) => {
        const x = (index % 5 - 2) * 2.5
        const z = (Math.floor(index / 5) - 2) * 2.5
        const height = 0.6 + (index * 7 % 5) * 0.45
        return <mesh key={index} position={[x, height / 2, z]}><boxGeometry args={[1, height, 1]} /><meshStandardMaterial color={index === 12 ? '#4f46e5' : index % 2 ? '#a5b4fc' : '#818cf8'} roughness={0.5} /></mesh>
      })}
      <OrbitRig key={revision} name={name} />
    </>
  )
}

// Accessible switches isolate each control behavior while real pose readings explain its effect.
export function OrbitPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const settings = useOrbitDemoStore((state) => state.settings[name])
  const reading = useOrbitDemoStore((state) => state.readings[name])
  const setParameter = useOrbitDemoStore((state) => state.setParameter)
  const reset = useOrbitDemoStore((state) => state.reset)
  return (
    <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='font-mono text-xs'>{name}</h3><Button onClick={() => reset(name)} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      {['enablePan', 'enableRotate', 'enableZoom', 'enableDamping', 'screenSpacePanning'].map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`orbitControls.${key}`)}</Label><Switch checked={settings[key]} onChange={(value) => setParameter(name, key, value)} className='group inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}
      {[['dampingFactor', 0.01, 0.3, 0.01], ['maxDistance', 6, 40, 1], ['maxPolar', 20, 89, 1]].map(([key, min, max, step]) => <Field key={key}><div className='mb-3 flex justify-between text-xs'><Label className='text-slate-600'>{t(`orbitControls.${key}`)}</Label><output className='font-mono text-indigo-600'>{settings[key]}{key === 'maxPolar' ? '°' : key === 'maxDistance' ? ' m' : ''}</output></div><Input type='range' min={min} max={max} step={step} value={settings[key]} disabled={key === 'dampingFactor' && !settings.enableDamping} onChange={(event) => setParameter(name, key, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 disabled:opacity-30 focus-visible:outline-2' /></Field>)}
      {reading && <dl className='space-y-2 rounded-lg bg-indigo-50 p-3 text-[11px] text-indigo-900'>{[['position', reading.position.join(' / ') + ' m'], ['target', reading.target.join(' / ') + ' m'], ['distance', reading.distance + ' m'], ['polar', reading.polar + '°']].map(([key, value]) => <div key={key}><dt className='mb-0.5 text-indigo-500'>{t(`orbitControls.${key}`)}</dt><dd className='break-words font-mono'>{value}</dd></div>)}</dl>}
      <p className='text-xs leading-6 text-slate-500'>{t(name === 'MapControls' ? 'orbitControls.mapHint' : 'orbitControls.orbitHint')}</p>
    </section>
  )
}

// Both lessons share geometry while mounting only the control named by the current route.
export default function OrbitDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  return <div role='group' aria-label={t('orbitControls.label')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [8, 9, 10], fov: 50, near: 0.1, far: 150 }} dpr={[1, 2]}><OrbitScene name={name} /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('orbitControls.marker')}</span></div>
}
