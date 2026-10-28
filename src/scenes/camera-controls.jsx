import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import * as THREE from 'three'
import { Button, Field, Input, Label, Switch } from '@headlessui/react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

// Both APIs start with the same camera behavior so their lifecycle differences are directly comparable.
const initial = { smooth: true, smoothTime: 0.5, maxDistance: 20, input: 'orbit' }

// Commands are explicit requests; sampled camera state never restarts a transition.
export const useCameraControlStore = create((set) => ({
  settings: { CameraControls: { ...initial }, CameraControlsImpl: { ...initial } },
  commands: {}, readings: {}, status: {},
  setParameter: (name, key, value) => set((state) => ({ settings: { ...state.settings, [name]: { ...state.settings[name], [key]: value } } })),
  command: (name, type) => set((state) => ({ commands: { ...state.commands, [name]: { id: (state.commands[name]?.id || 0) + 1, type } } })),
  reset: (name) => set((state) => ({ settings: { ...state.settings, [name]: { ...initial } }, commands: { ...state.commands, [name]: { id: (state.commands[name]?.id || 0) + 1, type: 'overview' } } }))
}))

// A manually constructed instance proves the implementation-class export without hiding its lifecycle in JSX.
function CameraRig ({ name, model }) {
  const ref = useRef(null)
  const camera = useThree((state) => state.camera)
  const canvas = useThree((state) => state.gl.domElement)
  const get = useThree((state) => state.get)
  const set = useThree((state) => state.set)
  const lastSample = useRef(0)
  const position = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const manual = name === 'CameraControlsImpl'
  const settings = useCameraControlStore((state) => state.settings[name])
  const command = useCameraControlStore((state) => state.commands[name])

  useEffect(() => {
    if (!manual) return
    CameraControlsImpl.install({ THREE })
    const control = new CameraControlsImpl(camera, canvas)
    const previous = get().controls
    ref.current = control
    set({ controls: control })
    return () => {
      control.dispose()
      if (get().controls === control) set({ controls: previous })
      ref.current = null
    }
  }, [manual, camera, canvas, get, set])

  useEffect(() => {
    const control = ref.current
    if (!control) return
    control.smoothTime = settings.smoothTime
    control.minDistance = 3
    control.maxDistance = settings.maxDistance
    const { ACTION } = CameraControlsImpl
    control.mouseButtons.left = settings.input === 'map' ? ACTION.TRUCK : settings.input === 'none' ? ACTION.NONE : ACTION.ROTATE
    control.mouseButtons.right = settings.input === 'map' ? ACTION.ROTATE : settings.input === 'none' ? ACTION.NONE : ACTION.TRUCK
    control.mouseButtons.middle = settings.input === 'none' ? ACTION.NONE : ACTION.DOLLY
    control.mouseButtons.wheel = settings.input === 'none' ? ACTION.NONE : ACTION.DOLLY
    control.touches.one = settings.input === 'map' ? ACTION.TOUCH_TRUCK : settings.input === 'none' ? ACTION.NONE : ACTION.TOUCH_ROTATE
    control.touches.two = settings.input === 'none' ? ACTION.NONE : ACTION.TOUCH_DOLLY_TRUCK
    control.touches.three = settings.input === 'none' ? ACTION.NONE : ACTION.TOUCH_DOLLY_TRUCK
  }, [settings])

  useEffect(() => {
    const control = ref.current
    if (!control) return
    void control.setLookAt(7, 4, 9, 0, 1, 0, false)
    return () => control.stop()
  }, [name])

  useEffect(() => {
    if (!command || !ref.current) return
    const control = ref.current
    let current = true
    const smooth = useCameraControlStore.getState().settings[name].smooth
    useCameraControlStore.setState((state) => ({ status: { ...state.status, [name]: 'moving' } }))
    control.stop()
    let result
    if (command.type === 'fit') result = control.fitToBox(model.current, smooth, { paddingLeft: 0.5, paddingRight: 0.5, paddingTop: 0.5, paddingBottom: 0.5 })
    else {
      const poses = { front: [0, 2, 10, 0, 1, 0], side: [10, 2, 0, 0, 1, 0], overview: [7, 4, 9, 0, 1, 0] }
      result = control.setLookAt(...poses[command.type], smooth)
    }
    Promise.resolve(result).then(() => {
      if (current) useCameraControlStore.setState((state) => ({ status: { ...state.status, [name]: 'rest' } }))
    }).catch(() => {
      if (current) useCameraControlStore.setState((state) => ({ status: { ...state.status, [name]: 'error' } }))
    })
    return () => { current = false }
  }, [command, model, name])

  useFrame((_, delta) => {
    if (manual) ref.current?.update(delta)
  }, -1)

  useFrame(({ clock }) => {
    const control = ref.current
    if (!control || clock.elapsedTime - lastSample.current < 0.15) return
    lastSample.current = clock.elapsedTime
    control.getPosition(position)
    control.getTarget(target)
    const reading = { position: position.toArray().map((n) => Number(n.toFixed(2))), target: target.toArray().map((n) => Number(n.toFixed(2))), distance: control.distance.toFixed(2), native: control instanceof CameraControlsImpl }
    useCameraControlStore.setState((state) => ({ readings: { ...state.readings, [name]: reading } }))
  })

  return manual ? null : <CameraControls ref={ref} makeDefault />
}

// A three-object arrangement gives fitToBox a meaningful asymmetric bounding volume.
function CameraControlScene ({ name }) {
  const model = useRef(null)
  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <directionalLight position={[5, 8, 5]} intensity={3} />
      <directionalLight position={[-5, 3, -5]} intensity={1} color='#c7d2fe' />
      <gridHelper args={[40, 40, '#818cf8', '#c7d2fe']} />
      <group ref={model}>
        <mesh position={[0, 0.75, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color='#6366f1' /></mesh>
        <mesh position={[-2.3, 1, 0]}><torusGeometry args={[0.7, 0.25, 20, 48]} /><meshStandardMaterial color='#a78bfa' /></mesh>
        <mesh position={[2.3, 1, 0]}><coneGeometry args={[0.7, 2, 32]} /><meshStandardMaterial color='#38bdf8' /></mesh>
      </group>
      <CameraRig name={name} model={model} />
    </>
  )
}

// Presets and fit commands exercise native transition methods instead of directly teleporting the camera.
export function CameraControlPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const settings = useCameraControlStore((state) => state.settings[name])
  const reading = useCameraControlStore((state) => state.readings[name])
  const status = useCameraControlStore((state) => state.status[name] || 'idle')
  const { command, setParameter, reset } = useCameraControlStore.getState()
  return (
    <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-xs'>{t('cameraControlUI.title')}</h3><Button onClick={() => reset(name)} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <p role='status' className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800'>{t(`cameraControlUI.status.${status}`)}</p>
      <div className='grid grid-cols-2 gap-2'>{['front', 'side', 'overview', 'fit'].map((type) => <Button key={type} onClick={() => command(name, type)} className='cursor-pointer rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-100 focus-visible:outline-2'>{t(`cameraControlUI.${type}`)}</Button>)}</div>
      <Field className='flex items-center justify-between'><Label className='text-xs'>{t('cameraControlUI.smooth')}</Label><Switch checked={settings.smooth} onChange={(value) => setParameter(name, 'smooth', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>
      {[['smoothTime', 0.1, 1.5, 0.1], ['maxDistance', 5, 30, 1]].map(([key, min, max, step]) => <Field key={key}><div className='mb-3 flex justify-between text-xs'><Label>{t(`cameraControlUI.${key}`)}</Label><output className='font-mono text-indigo-600'>{settings[key]}</output></div><Input type='range' min={min} max={max} step={step} value={settings[key]} onChange={(event) => setParameter(name, key, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 focus-visible:outline-2' /></Field>)}
      <p className='text-xs text-slate-600'>{t('cameraControlUI.input')}</p><div className='flex gap-2'>{['orbit', 'map', 'none'].map((mode) => <Button key={mode} aria-pressed={settings.input === mode} onClick={() => setParameter(name, 'input', mode)} className={`flex-1 cursor-pointer rounded-lg border px-2 py-2 text-xs focus-visible:outline-2 ${settings.input === mode ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(`cameraControlUI.${mode}`)}</Button>)}</div>
      {reading && <dl className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900'>{[['position', reading.position.join(' / ') + ' m'], ['target', reading.target.join(' / ') + ' m'], ['distance', reading.distance + ' m']].map(([key, value]) => <div key={key}><dt className='mb-1 text-indigo-500'>{t(`cameraControlUI.${key}`)}</dt><dd className='font-mono'>{value}</dd></div>)}<div><dt className='mb-1 text-indigo-500'>instanceof CameraControlsImpl</dt><dd className='font-mono'>{String(reading.native)}</dd></div></dl>}
      <p className='text-xs leading-6 text-slate-500'>{t(name === 'CameraControlsImpl' ? 'cameraControlUI.manualHint' : 'cameraControlUI.wrapperHint')}</p>
    </section>
  )
}

// Component and manual-class routes use identical geometry while proving different integration paths.
export default function CameraControlDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  return <div role='group' aria-label={t('cameraControlUI.label')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [7, 4, 9], fov: 50, near: 0.1, far: 100 }} dpr={[1, 2]}><CameraControlScene name={name} /></Canvas></div>
}
