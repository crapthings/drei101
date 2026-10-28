import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ArcballControls, TrackballControls } from '@react-three/drei'
import { Button, Field, Input, Label, Switch } from '@headlessui/react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

// Both free-rotation controls expose their own native damping model rather than sharing false equivalents.
const initial = { rotate: true, pan: true, zoom: true, inertia: true, rotateSpeed: 1, scaleFactor: 1.1, dynamicDampingFactor: 0.2, dampingFactor: 25, maxDistance: 20, gizmos: true, revision: 0 }

// Per-route settings preserve independent experiments while telemetry stays separate from configuration.
export const useBallStore = create((set) => ({
  settings: { TrackballControls: { ...initial }, ArcballControls: { ...initial } },
  readings: {},
  setParameter: (name, key, value) => set((state) => ({ settings: { ...state.settings, [name]: { ...state.settings[name], [key]: value } } })),
  reset: (name) => set((state) => ({ settings: { ...state.settings, [name]: { ...initial, revision: state.settings[name].revision + 1 } } }))
}))

// The version-specific Arcball bridge attaches native gizmos omitted by drei's two-argument constructor.
function BallRig ({ name }) {
  const ref = useRef(null)
  const gizmos = useRef(null)
  const lastSample = useRef(0)
  const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)
  const size = useThree((state) => state.size)
  const settings = useBallStore((state) => state.settings[name])
  const arc = name === 'ArcballControls'

  useEffect(() => {
    const control = ref.current
    camera.position.set(5, 3, 7)
    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
    control.target.set(0, 0, 0)
    if (arc) {
      control.scene = scene
      control.setCamera(camera)
      // drei 10.7.9 does not pass scene into the underlying Arcball constructor.
      gizmos.current = control._gizmos
      scene.add(gizmos.current)
    } else {
      // Pointer-only teaching controls must not capture A/S/D typed into the page search field.
      window.removeEventListener('keydown', control.keydown)
      window.removeEventListener('keyup', control.keyup)
    }
    control.update()
    return () => {
      if (gizmos.current) {
        scene.remove(gizmos.current)
        const resources = new Set()
        gizmos.current.traverse((object) => {
          if (object.geometry) resources.add(object.geometry)
          if (object.material) {
            for (const material of Array.isArray(object.material) ? object.material : [object.material]) resources.add(material)
          }
        })
        for (const resource of resources) resource.dispose()
      }
    }
  }, [arc, camera, scene])

  useEffect(() => {
    if (arc) ref.current.setGizmosVisible(settings.gizmos)
  }, [arc, settings.gizmos])

  useEffect(() => {
    if (arc) ref.current.onWindowResize()
    else ref.current.handleResize()
  }, [arc, size])

  useFrame(({ clock }) => {
    if (!ref.current || clock.elapsedTime - lastSample.current < 0.15) return
    lastSample.current = clock.elapsedTime
    const target = arc ? gizmos.current?.position : ref.current.target
    if (!target) return
    const reading = {
      position: camera.position.toArray().map((value) => Number(value.toFixed(2))),
      up: camera.up.toArray().map((value) => Number(value.toFixed(3))),
      target: target.toArray().map((value) => Number(value.toFixed(2))),
      distance: camera.position.distanceTo(target).toFixed(2)
    }
    useBallStore.setState((state) => ({ readings: { ...state.readings, [name]: reading } }))
  })

  return arc
    ? <ArcballControls ref={ref} makeDefault enableRotate={settings.rotate} enablePan={settings.pan} enableZoom={settings.zoom} enableAnimations={settings.inertia} dampingFactor={settings.dampingFactor} scaleFactor={settings.scaleFactor} minDistance={3} maxDistance={settings.maxDistance} />
    : <TrackballControls ref={ref} makeDefault noRotate={!settings.rotate} noPan={!settings.pan} noZoom={!settings.zoom} staticMoving={!settings.inertia} dynamicDampingFactor={settings.dynamicDampingFactor} rotateSpeed={settings.rotateSpeed} minDistance={3} maxDistance={settings.maxDistance} />
}

// An asymmetric assembly and world axes make roll visible without relying only on camera numbers.
function BallScene ({ name }) {
  const revision = useBallStore((state) => state.settings[name].revision)
  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <directionalLight position={[5, 7, 6]} intensity={3} />
      <directionalLight position={[-5, 2, -4]} intensity={1} color='#c7d2fe' />
      <mesh><boxGeometry args={[2, 1, 1]} /><meshStandardMaterial color='#6366f1' /></mesh>
      <mesh position={[1.5, 1, 0]}><sphereGeometry args={[0.5, 32, 24]} /><meshStandardMaterial color='#c084fc' /></mesh>
      <mesh position={[-1.5, -0.5, 0]} rotation-z={Math.PI / 2}><coneGeometry args={[0.5, 1, 24]} /><meshStandardMaterial color='#38bdf8' /></mesh>
      <axesHelper args={[3]} />
      <gridHelper args={[24, 24, '#818cf8', '#c7d2fe']} position={[0, -1.5, 0]} />
      <BallRig key={revision} name={name} />
    </>
  )
}

// Positive UI labels map explicitly to Trackball's negative flags and Arcball's positive flags.
export function BallPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const arc = name === 'ArcballControls'
  const settings = useBallStore((state) => state.settings[name])
  const reading = useBallStore((state) => state.readings[name])
  const setParameter = useBallStore((state) => state.setParameter)
  const reset = useBallStore((state) => state.reset)
  const fields = [arc ? ['scaleFactor', 1.01, 1.5, 0.01] : ['rotateSpeed', 0.2, 3, 0.1], arc ? ['dampingFactor', 5, 50, 1] : ['dynamicDampingFactor', 0.05, 0.5, 0.05], ['maxDistance', 5, 30, 1]]
  return (
    <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='font-mono text-xs'>{name}</h3><Button onClick={() => reset(name)} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      {['rotate', 'pan', 'zoom', 'inertia', ...(arc ? ['gizmos'] : [])].map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`ballControls.${key}`)}</Label><Switch checked={settings[key]} onChange={(value) => setParameter(name, key, value)} className='group inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}
      {fields.map(([key, min, max, step]) => <Field key={key}><div className='mb-3 flex justify-between text-xs'><Label className='text-slate-600'>{t(`ballControls.${key}`)}</Label><output className='font-mono text-indigo-600'>{settings[key]}</output></div><Input type='range' min={min} max={max} step={step} value={settings[key]} disabled={key.includes('amping') && !settings.inertia} onChange={(event) => setParameter(name, key, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 disabled:opacity-30 focus-visible:outline-2' /></Field>)}
      {reading && <dl className='space-y-2 rounded-lg bg-indigo-50 p-3 text-[11px] text-indigo-900'>{[['position', reading.position.join(' / ') + ' m'], ['up', reading.up.join(' / ')], ['target', reading.target.join(' / ') + ' m'], ['distance', reading.distance + ' m']].map(([key, value]) => <div key={key}><dt className='mb-0.5 text-indigo-500'>{t(`ballControls.${key}`)}</dt><dd className='font-mono'>{value}</dd></div>)}</dl>}
      <p className='text-xs leading-6 text-slate-500'>{t(arc ? 'ballControls.arcHint' : 'ballControls.trackHint')}</p>
    </section>
  )
}

// Independent canvases avoid competing controls while preserving a common visual reference.
export default function BallDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  return <div role='group' aria-label={t('ballControls.label')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [5, 3, 7], fov: 50, near: 0.1, far: 100 }} dpr={[1, 2]}><BallScene name={name} /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('ballControls.axes')}</span></div>
}
