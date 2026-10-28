import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { DeviceOrientationControls, Html } from '@react-three/drei'
import { Button, Field, Input, Label } from '@headlessui/react'
import { Euler, MathUtils, Quaternion } from 'three'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// Sensor acquisition is explicit, while preview values remain usable without device permissions.
export const useOrientationStore = create((set, get) => ({
  request: 0,
  mode: 'preview',
  status: 'preview',
  alpha: 0,
  beta: 90,
  gamma: 0,
  offset: 0,
  readings: null,
  setParameter: (name, value) => set({ [name]: value }),
  preview: () => set((state) => ({ request: state.request + 1, mode: 'preview', status: 'preview', readings: null })),
  reset: () => set((state) => ({ request: state.request + 1, mode: 'preview', status: 'preview', alpha: 0, beta: 90, gamma: 0, offset: 0, readings: null })),
  startSensor: async () => {
    if (!window.isSecureContext) return set({ status: 'insecure' })
    if (!window.DeviceOrientationEvent) return set({ status: 'unsupported' })
    const request = get().request + 1
    set({ request, status: 'requesting', readings: null })
    try {
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await window.DeviceOrientationEvent.requestPermission()
        if (get().request !== request) return
        if (permission !== 'granted') return set({ status: 'denied' })
      }
      set({ mode: 'sensor', status: 'waiting' })
    } catch {
      if (get().request === request) set({ mode: 'preview', status: 'denied' })
    }
  }
}))

// Preview reproduces the orientation math without pretending to supply real sensor readings.
function OrientationPreview () {
  const camera = useThree((state) => state.camera)
  const euler = useMemo(() => new Euler(), [])
  const correction = useMemo(() => new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)), [])
  const { alpha, beta, gamma, offset } = useOrientationStore()
  useFrame(() => {
    euler.set(MathUtils.degToRad(beta), MathUtils.degToRad(alpha + offset), -MathUtils.degToRad(gamma), 'YXZ')
    camera.quaternion.setFromEuler(euler).multiply(correction)
  })
  return null
}

// Real device events feed a status display and are removed when sensor mode ends.
function SensorControls () {
  const offset = useOrientationStore((state) => state.offset)
  const receiving = useOrientationStore((state) => state.status === 'receiving')
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.enabled = receiving
  }, [receiving])
  useEffect(() => {
    let received = false
    let lastReport = 0
    const receive = (event) => {
      if (![event.alpha, event.beta, event.gamma].every(Number.isFinite)) return
      received = true
      if (performance.now() - lastReport < 100) return
      lastReport = performance.now()
      useOrientationStore.setState({ status: 'receiving', readings: { alpha: event.alpha, beta: event.beta, gamma: event.gamma } })
    }
    window.addEventListener('deviceorientation', receive)
    const timeout = window.setTimeout(() => {
      if (!received) useOrientationStore.setState({ status: 'noData' })
    }, 3000)
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('deviceorientation', receive)
    }
  }, [])
  return <DeviceOrientationControls ref={ref} enabled={receiving} makeDefault alphaOffset={MathUtils.degToRad(offset)} />
}

// Colored direction markers reveal camera rotation without confusing it with translation.
function OrientationScene () {
  const { t } = useTranslation()
  const mode = useOrientationStore((state) => state.mode)
  const markers = [[0, 0, -5, '#6366f1', 'front'], [5, 0, 0, '#38bdf8', 'right'], [0, 0, 5, '#e879f9', 'back'], [-5, 0, 0, '#fbbf24', 'left']]
  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <gridHelper args={[24, 24, '#818cf8', '#c7d2fe']} position={[0, -2, 0]} />
      {markers.map(([x, y, z, color, label]) => <group key={label} position={[x, y, z]}><mesh><boxGeometry args={[1.2, 1.2, 1.2]} /><meshBasicMaterial color={color} /></mesh><Html center position={[0, 1, 0]}><span className='whitespace-nowrap rounded-md bg-white/90 px-2 py-1 text-xs text-indigo-900'>{t(`orientationControls.${label}`)}</span></Html></group>)}
      {mode === 'sensor' ? <SensorControls /> : <OrientationPreview />}
    </>
  )
}

// Explicit permission, simulation labels and sensor status keep desktop and mobile behavior clear.
export function OrientationPanel () {
  const { t } = useTranslation()
  const state = useOrientationStore()
  return (
    <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-sm font-medium'>{t('orientationControls.title')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <p role='status' className='rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-800'>{t(`orientationControls.status.${state.status}`)}</p>
      <Button disabled={state.status === 'requesting'} onClick={state.mode === 'sensor' ? state.preview : state.startSensor} className='w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white focus-visible:outline-2'>{t(state.mode === 'sensor' ? 'orientationControls.preview' : 'orientationControls.start')}</Button>
      {['alpha', 'beta', 'gamma', 'offset'].map((name) => <Field key={name}><div className='mb-3 flex justify-between text-xs'><Label>{name === 'offset' ? t('orientationControls.offset') : name}</Label><output className='font-mono text-indigo-600'>{state[name]}°</output></div><Input type='range' min={name === 'alpha' ? 0 : name === 'gamma' ? -90 : -180} max={name === 'alpha' ? 360 : name === 'gamma' ? 90 : 180} step={1} disabled={state.mode === 'sensor' && name !== 'offset'} value={state[name]} onChange={(event) => state.setParameter(name, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 disabled:opacity-30 focus-visible:outline-2' /></Field>)}
      {state.mode === 'sensor' && state.readings && <output className='block font-mono text-xs text-slate-500'>α {state.readings.alpha.toFixed(1)}° · β {state.readings.beta.toFixed(1)}° · γ {state.readings.gamma.toFixed(1)}°</output>}
      <p className='text-xs leading-6 text-slate-500'>{t('orientationControls.hint')}</p>
    </section>
  )
}

// Leaving the page stops the sensor session and disposes the scene's control listeners.
export default function OrientationDemo () {
  const { t } = useTranslation()
  const mode = useOrientationStore((state) => state.mode)
  useEffect(() => () => useOrientationStore.getState().preview(), [])
  return <div role='img' aria-label={t('orientationControls.label')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 0], fov: 65, near: 0.1, far: 40 }} dpr={[1, 2]}><OrientationScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t(mode === 'sensor' ? 'orientationControls.sensorMode' : 'orientationControls.previewMode')}</span><div className='pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-indigo-400'>+</div></div>
}
