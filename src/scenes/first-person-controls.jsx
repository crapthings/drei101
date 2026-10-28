import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { FirstPersonControls, PointerLockControls } from '@react-three/drei'
import { Button, Field, Input, Label, Switch } from '@headlessui/react'
import { Vector3 } from 'three'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

// Lock state comes from real browser events; walking is an explicitly separate application feature.
export const useLockStore = create((set) => ({
  locked: false, status: 'idle', pointerSpeed: 1, walking: false, movementSpeed: 3, pitch: 60, revision: 0,
  setParameter: (name, value) => set({ [name]: value }),
  onLock: () => set({ locked: true, status: 'locked' }),
  onUnlock: () => set({ locked: false, status: 'idle' }),
  reset: () => {
    if (document.pointerLockElement) document.exitPointerLock()
    set((state) => ({ locked: false, status: 'idle', pointerSpeed: 1, walking: false, movementSpeed: 3, pitch: 60, revision: state.revision + 1 }))
  }
}))

// Focus is shared with the panel so navigation and search never silently steer the first-person scene.
export const useFirstPersonStore = create((set) => ({
  active: true, focused: false, movementSpeed: 3, lookSpeed: 0.05, activeLook: true, lookVertical: true, revision: 0,
  setParameter: (name, value) => set({ [name]: value }),
  reset: () => set((state) => ({ active: true, focused: false, movementSpeed: 3, lookSpeed: 0.05, activeLook: true, lookVertical: true, revision: state.revision + 1 }))
}))

// Sampled camera readings stay outside settings to avoid restarting native control listeners.
const useWalkReadings = create(() => ({ readings: {} }))

// Pointer lock controls rotation; optional WASD translation is implemented explicitly by this demo.
function LockRig () {
  const ref = useRef(null)
  const keys = useRef(new Set())
  const camera = useThree((state) => state.camera)
  const canvas = useThree((state) => state.gl.domElement)
  const pointerSpeed = useLockStore((state) => state.pointerSpeed)
  const pitch = useLockStore((state) => state.pitch)
  const revision = useLockStore((state) => state.revision)
  const onLock = useLockStore((state) => state.onLock)
  const onUnlock = useLockStore((state) => state.onUnlock)

  useEffect(() => {
    camera.position.set(0, 1.6, 8)
    camera.rotation.set(0, 0, 0)
  }, [camera, revision])

  useEffect(() => {
    const clear = () => keys.current.clear()
    const change = () => {
      clear()
      if (document.pointerLockElement !== canvas) useLockStore.getState().onUnlock()
    }
    const error = () => useLockStore.setState({ status: document.hasFocus() ? 'error' : 'background', locked: false })
    const down = (event) => {
      if (!ref.current?.isLocked || !useLockStore.getState().walking) return
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        event.preventDefault()
        keys.current.add(event.code)
      }
    }
    const up = (event) => keys.current.delete(event.code)
    document.addEventListener('keydown', down)
    document.addEventListener('keyup', up)
    document.addEventListener('pointerlockchange', change)
    document.addEventListener('pointerlockerror', error)
    window.addEventListener('blur', clear)
    return () => {
      clear()
      if (document.pointerLockElement === canvas) document.exitPointerLock()
      document.removeEventListener('keydown', down)
      document.removeEventListener('keyup', up)
      document.removeEventListener('pointerlockchange', change)
      document.removeEventListener('pointerlockerror', error)
      window.removeEventListener('blur', clear)
      useLockStore.getState().onUnlock()
    }
  }, [canvas])

  useFrame((_, delta) => {
    const state = useLockStore.getState()
    if (!ref.current?.isLocked || !state.walking) return
    const forward = Number(keys.current.has('KeyW')) - Number(keys.current.has('KeyS'))
    const right = Number(keys.current.has('KeyD')) - Number(keys.current.has('KeyA'))
    const length = Math.hypot(forward, right)
    if (!length) return
    const distance = state.movementSpeed * Math.min(delta, 0.05) / length
    ref.current.moveForward(forward * distance)
    ref.current.moveRight(right * distance)
  })

  return <PointerLockControls ref={ref} domElement={canvas} makeDefault selector='#pointer-lock-enter' pointerSpeed={pointerSpeed} minPolarAngle={(90 - pitch) * Math.PI / 180} maxPolarAngle={(90 + pitch) * Math.PI / 180} onLock={onLock} onUnlock={onUnlock} />
}

// The native first-person instance is reconnected and disposed explicitly for the installed drei wrapper.
function FirstPersonRig () {
  const ref = useRef(null)
  const canvas = useThree((state) => state.gl.domElement)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const { t } = useTranslation()
  const active = useFirstPersonStore((state) => state.active)
  const focused = useFirstPersonStore((state) => state.focused)
  const movementSpeed = useFirstPersonStore((state) => state.movementSpeed)
  const lookSpeed = useFirstPersonStore((state) => state.lookSpeed)
  const activeLook = useFirstPersonStore((state) => state.activeLook)
  const lookVertical = useFirstPersonStore((state) => state.lookVertical)
  const revision = useFirstPersonStore((state) => state.revision)

  useEffect(() => {
    const control = ref.current
    control.dispose()
    control.connect(canvas)
    window.removeEventListener('keydown', control.onKeyDown)
    window.removeEventListener('keyup', control.onKeyUp)
    canvas.removeEventListener('mousemove', control.onMouseMove)
    canvas.tabIndex = 0
    canvas.setAttribute('aria-label', t('walkControls.canvas'))
    const stop = () => {
      for (const key of ['moveForward', 'moveBackward', 'moveLeft', 'moveRight', 'moveUp', 'moveDown']) control[key] = false
      control.mouseX = 0
      control.mouseY = 0
      control.mouseDragOn = false
    }
    const focus = () => useFirstPersonStore.setState({ focused: true })
    const blur = () => {
      stop()
      useFirstPersonStore.setState({ focused: false })
    }
    const keydown = (event) => {
      if (event.code.startsWith('Arrow')) event.preventDefault()
      control.onKeyDown(event)
    }
    const mousemove = (event) => {
      if (document.activeElement !== canvas) return
      const rect = canvas.getBoundingClientRect()
      control.mouseX = event.clientX - rect.left - rect.width / 2
      control.mouseY = event.clientY - rect.top - rect.height / 2
    }
    canvas.addEventListener('focus', focus)
    canvas.addEventListener('blur', blur)
    canvas.addEventListener('keydown', keydown)
    canvas.addEventListener('keyup', control.onKeyUp)
    canvas.addEventListener('mousemove', mousemove)
    canvas.addEventListener('mouseleave', stop)
    window.addEventListener('blur', blur)
    window.addEventListener('mouseup', control.onMouseUp)
    document.addEventListener('visibilitychange', blur)
    stop()
    return () => {
      blur()
      canvas.removeEventListener('focus', focus)
      canvas.removeEventListener('blur', blur)
      canvas.removeEventListener('keydown', keydown)
      canvas.removeEventListener('keyup', control.onKeyUp)
      canvas.removeEventListener('mousemove', mousemove)
      canvas.removeEventListener('mouseleave', stop)
      window.removeEventListener('blur', blur)
      window.removeEventListener('mouseup', control.onMouseUp)
      document.removeEventListener('visibilitychange', blur)
      control.dispose()
    }
  }, [canvas, t])

  useEffect(() => {
    camera.position.set(0, 1.6, 8)
    camera.up.set(0, 1, 0)
    ref.current.lookAt(new Vector3(0, 1.6, 0))
  }, [camera, revision])

  useEffect(() => ref.current.handleResize(), [size])

  return <FirstPersonControls ref={ref} makeDefault enabled={active && focused} movementSpeed={movementSpeed} lookSpeed={lookSpeed} activeLook={activeLook} lookVertical={lookVertical} />
}

// A door-free outdoor gallery isolates viewing and locomotion without implying physical collision.
function WalkScene ({ name }) {
  const lastSample = useRef(0)
  const direction = useMemo(() => new Vector3(), [])
  useFrame(({ camera, clock }) => {
    if (clock.elapsedTime - lastSample.current < 0.15) return
    lastSample.current = clock.elapsedTime
    const reading = { position: camera.position.toArray().map((n) => Number(n.toFixed(2))), direction: camera.getWorldDirection(direction).toArray().map((n) => Number(n.toFixed(3))) }
    useWalkReadings.setState((state) => ({ readings: { ...state.readings, [name]: reading } }))
  })
  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <fog attach='fog' args={['#eef2ff', 25, 65]} />
      <directionalLight position={[5, 9, 4]} intensity={3} />
      <directionalLight position={[-4, 3, -6]} intensity={1} color='#c7d2fe' />
      <gridHelper args={[80, 80, '#818cf8', '#c7d2fe']} position={[0, 0, -15]} />
      {Array.from({ length: 10 }, (_, index) => [-1, 1].map((side) => <mesh key={`${index}-${side}`} position={[side * 3, 1 + index % 3 * 0.25, -index * 4]}><boxGeometry args={[1, 2 + index % 3 * 0.5, 1]} /><meshStandardMaterial color={side < 0 ? '#6366f1' : '#a5b4fc'} /></mesh>))}
      {name === 'PointerLockControls' ? <LockRig /> : <FirstPersonRig />}
    </>
  )
}

// Real camera position and direction reveal whether an experiment changes rotation or translation.
function WalkReadings ({ name }) {
  const { t } = useTranslation()
  const reading = useWalkReadings((state) => state.readings[name])
  if (!reading) return null
  return <dl className='space-y-3 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900'>{['position', 'direction'].map((key) => <div key={key}><dt className='mb-1 text-indigo-500'>{t(`walkControls.${key}`)}</dt><dd className='font-mono'>{reading[key].join(' / ')}{key === 'position' ? ' m' : ''}</dd></div>)}</dl>
}

// Lock acquisition remains tied to a single visible start button and is never triggered by general page clicks.
export function LockPanel () {
  const { t } = useTranslation()
  const state = useLockStore()
  const supported = typeof document.documentElement.requestPointerLock === 'function'
  return (
    <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-sm'>{t('walkControls.lockTitle')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <p role='status' className='rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-800'>{t(supported ? `walkControls.lockStatus.${state.status}` : 'walkControls.lockStatus.unsupported')}</p>
      <Button id='pointer-lock-enter' disabled={!supported || state.locked} className='w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white disabled:cursor-default disabled:bg-slate-100 disabled:text-slate-400 focus-visible:outline-2'>{t('walkControls.enter')}</Button>
      <Field className='flex items-center justify-between gap-3'><Label className='text-xs'>{t('walkControls.walking')}</Label><Switch checked={state.walking} onChange={(value) => state.setParameter('walking', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>
      {[['pointerSpeed', 0.2, 3, 0.1], ['pitch', 20, 85, 1], ['movementSpeed', 1, 8, 0.5]].map(([key, min, max, step]) => <Field key={key}><div className='mb-3 flex justify-between text-xs'><Label>{t(`walkControls.${key}`)}</Label><output className='font-mono text-indigo-600'>{state[key]}{key === 'pitch' ? '°' : ''}</output></div><Input type='range' min={min} max={max} step={step} disabled={key === 'movementSpeed' && !state.walking} value={state[key]} onChange={(event) => state.setParameter(key, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 disabled:opacity-30 focus-visible:outline-2' /></Field>)}
      <WalkReadings name='PointerLockControls' />
      <p className='text-xs leading-6 text-slate-500'>{t('walkControls.lockHint')}</p>
    </section>
  )
}

// Native first-person movement is separate from pointer locking and pauses whenever canvas focus is lost.
export function FirstPersonPanel () {
  const { t } = useTranslation()
  const state = useFirstPersonStore()
  return (
    <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-sm'>{t('walkControls.firstTitle')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <p role='status' className='rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-800'>{t(!state.active ? 'walkControls.paused' : state.focused ? 'walkControls.focused' : 'walkControls.unfocused')}</p>
      <Button onClick={() => state.setParameter('active', !state.active)} className='w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white focus-visible:outline-2'>{t(state.active ? 'flightControls.pause' : 'flightControls.resume')}</Button>
      {['activeLook', 'lookVertical'].map((key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs'>{t(`walkControls.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setParameter(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>)}
      {[['movementSpeed', 1, 8, 0.5], ['lookSpeed', 0.005, 0.1, 0.005]].map(([key, min, max, step]) => <Field key={key}><div className='mb-3 flex justify-between text-xs'><Label>{t(`walkControls.${key}`)}</Label><output className='font-mono text-indigo-600'>{state[key]}</output></div><Input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setParameter(key, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 focus-visible:outline-2' /></Field>)}
      <WalkReadings name='FirstPersonControls' />
      <p className='text-xs leading-6 text-slate-500'>{t('walkControls.firstHint')}</p>
    </section>
  )
}

// The gallery is shared for comparison while each route owns a single native controller.
export default function WalkDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  return <div role='group' aria-label={t('walkControls.label')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100 focus-within:ring-2 focus-within:ring-indigo-300'><Canvas camera={{ position: [0, 1.6, 8], fov: 65, near: 0.1, far: 100 }} dpr={[1, 2]}><WalkScene name={name} /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t(name === 'PointerLockControls' ? 'walkControls.lockOverlay' : 'walkControls.firstOverlay')}</span>{name === 'PointerLockControls' && <div className='pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-indigo-400'>+</div>}</div>
}
