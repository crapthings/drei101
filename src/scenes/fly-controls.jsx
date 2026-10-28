import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { FlyControls } from '@react-three/drei'
import { Button, Field, Input, Label } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// Flight parameters and sampled camera coordinates are shared by the scene and its panel.
export const useFlyStore = create((set) => ({
  movementSpeed: 3,
  rollSpeed: 0.5,
  active: true,
  revision: 0,
  position: [0, 2, 8],
  setParameter: (name, value) => set({ [name]: value }),
  reset: () => set((state) => ({ movementSpeed: 3, rollSpeed: 0.5, active: true, revision: state.revision + 1, position: [0, 2, 8] }))
}))

// Native flight input is scoped to the focused canvas and released on blur or tab changes.
function FlightRig () {
  const controls = useRef(null)
  const canvas = useThree((state) => state.gl.domElement)
  const { t } = useTranslation()
  const movementSpeed = useFlyStore((state) => state.movementSpeed)
  const rollSpeed = useFlyStore((state) => state.rollSpeed)

  useEffect(() => {
    const control = controls.current
    const stop = () => {
      for (const key of Object.keys(control.moveState)) control.moveState[key] = 0
      control.mouseStatus = 0
      control.movementSpeedMultiplier = 1
      control.updateMovementVector()
      control.updateRotationVector()
    }
    const keydown = (event) => {
      if (event.key === 'Tab') return
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault()
      control.keydown(event)
    }
    const focus = () => canvas.focus({ preventScroll: true })
    window.removeEventListener('keydown', control.keydown)
    window.removeEventListener('keyup', control.keyup)
    canvas.tabIndex = 0
    canvas.setAttribute('aria-label', t('flightControls.canvas'))
    control.getContainerDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      return { size: [rect.width, rect.height], offset: [rect.left + window.scrollX, rect.top + window.scrollY] }
    }
    canvas.addEventListener('keydown', keydown)
    canvas.addEventListener('keyup', control.keyup)
    canvas.addEventListener('pointerdown', focus)
    canvas.addEventListener('blur', stop)
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', stop)
    return () => {
      stop()
      canvas.removeEventListener('keydown', keydown)
      canvas.removeEventListener('keyup', control.keyup)
      canvas.removeEventListener('pointerdown', focus)
      canvas.removeEventListener('blur', stop)
      window.removeEventListener('blur', stop)
      document.removeEventListener('visibilitychange', stop)
    }
  }, [canvas, t])

  return <FlyControls ref={controls} makeDefault movementSpeed={movementSpeed} rollSpeed={rollSpeed} dragToLook />
}

// A corridor of one-meter blocks gives translation and roll an unambiguous spatial reference.
function FlightScene () {
  const active = useFlyStore((state) => state.active)
  const revision = useFlyStore((state) => state.revision)
  const camera = useThree((state) => state.camera)
  useEffect(() => {
    camera.position.set(0, 2, 8)
    camera.rotation.set(0, 0, 0)
  }, [camera, revision])
  const lastSample = useRef(0)
  useFrame(({ camera, clock }) => {
    if (clock.elapsedTime - lastSample.current < 0.2) return
    lastSample.current = clock.elapsedTime
    useFlyStore.setState({ position: camera.position.toArray().map((value) => Number(value.toFixed(2))) })
  })
  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <fog attach='fog' args={['#eef2ff', 25, 65]} />
      <directionalLight position={[5, 8, 5]} intensity={3} />
      <directionalLight position={[-4, 3, -4]} intensity={1} color='#c7d2fe' />
      <gridHelper args={[100, 100, '#818cf8', '#c7d2fe']} position={[0, 0, -20]} />
      {Array.from({ length: 12 }, (_, index) => [-1, 1].map((side) => <mesh key={`${index}-${side}`} position={[side * (3 + index % 3), 0.5, -index * 4]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={side < 0 ? '#6366f1' : '#a5b4fc'} /></mesh>))}
      {active && <FlightRig />}
    </>
  )
}

// Flight settings include a hard pause, reset and real camera-coordinate feedback.
export function FlightPanel () {
  const { t } = useTranslation()
  const state = useFlyStore()
  return (
    <section className='space-y-6 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-sm font-medium'>{t('flightControls.title')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <Button onClick={() => state.setParameter('active', !state.active)} className='w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white focus-visible:outline-2'>{t(state.active ? 'flightControls.pause' : 'flightControls.resume')}</Button>
      {[['movementSpeed', 0.5, 10, 0.5], ['rollSpeed', 0.1, 2, 0.1]].map(([name, min, max, step]) => <Field key={name}><div className='mb-3 flex justify-between text-xs'><Label>{t(`flightControls.${name}`)}</Label><output className='font-mono text-indigo-600'>{state[name]}</output></div><Input type='range' min={min} max={max} step={step} value={state[name]} onChange={(event) => state.setParameter(name, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 focus-visible:outline-2' /></Field>)}
      <div className='rounded-lg bg-indigo-50 p-3'><p className='mb-2 text-xs text-indigo-700'>{t('flightControls.position')}</p><output className='font-mono text-xs text-indigo-900'>{state.position.map((value) => value.toFixed(2)).join(' / ')} m</output></div>
      <dl className='space-y-3 text-xs text-slate-600'>{[['W / S', 'forward'], ['A / D', 'strafe'], ['R / F', 'height'], ['Q / E', 'roll'], ['↑ ↓ ← →', 'look'], ['Shift', 'slow']].map(([key, action]) => <div key={key} className='flex justify-between gap-3'><dt className='font-mono text-indigo-700'>{key}</dt><dd>{t(`flightControls.${action}`)}</dd></div>)}</dl>
      <p className='text-xs leading-6 text-slate-500'>{t('flightControls.hint')}</p>
    </section>
  )
}

// Scene-local focus prevents flight keystrokes from interfering with the surrounding lesson.
export default function FlightDemo () {
  const { t } = useTranslation()
  return <div role='group' aria-label={t('flightControls.label')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100 focus-within:ring-2 focus-within:ring-indigo-300'><Canvas camera={{ position: [0, 2, 8], fov: 60, near: 0.1, far: 100 }} dpr={[1, 2]}><FlightScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('flightControls.focusHint')}</span></div>
}
