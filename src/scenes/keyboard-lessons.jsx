import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { KeyboardControls, useKeyboardControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The mapping uses physical WASD keys and names each action independently of its key.
const keyMap = [
  { name: 'forward', keys: ['KeyW'] },
  { name: 'back', keys: ['KeyS'] },
  { name: 'left', keys: ['KeyA'] },
  { name: 'right', keys: ['KeyD'] }
]

// The lesson store exposes focus, action and position feedback to the surrounding panel.
export const useKeyboardLessonStore = create((set) => ({
  focused: false,
  actions: {},
  position: [0, 0],
  setFocus: (focused) => set({ focused, ...(!focused ? { actions: {} } : {}) }),
  setActions: (actions) => set({ actions }),
  setPosition: (position) => set({ position }),
  reset: () => set({ focused: false, actions: {}, position: [0, 0] })
}))

// The player reads fresh action state each frame and moves at two meters per second.
function KeyboardPlayer () {
  const mesh = useRef(null)
  const [, get] = useKeyboardControls()
  const forward = useKeyboardControls((state) => state.forward)
  useFrame((_, delta) => {
    const state = get()
    const x = Number(state.right) - Number(state.left)
    const y = Number(state.forward) - Number(state.back)
    const length = Math.hypot(x, y) || 1
    mesh.current.position.x = Math.max(-3, Math.min(3, mesh.current.position.x + x / length * 2 * Math.min(delta, 0.05)))
    mesh.current.position.y = Math.max(-2, Math.min(2, mesh.current.position.y + y / length * 2 * Math.min(delta, 0.05)))
    const position = [mesh.current.position.x, mesh.current.position.y].map((value) => Math.round(value * 100) / 100)
    const current = useKeyboardLessonStore.getState().position
    if (position[0] !== current[0] || position[1] !== current[1]) useKeyboardLessonStore.getState().setPosition(position)
  })
  const position = useKeyboardLessonStore.getState().position
  return <mesh ref={mesh} position={[position[0], position[1], 0]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={forward ? '#a78bfa' : '#4f46e5'} /></mesh>
}

// The stationary view retains the last position when keyboard focus leaves the demo.
function IdlePlayer () {
  const position = useKeyboardLessonStore((state) => state.position)
  return <mesh position={[position[0], position[1], 0]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='#4f46e5' /></mesh>
}

// The focusable surface scopes keyboard listeners and clears held actions on blur.
export default function KeyboardLessonDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const [element, setElement] = useState(null)
  const focused = useKeyboardLessonStore((state) => state.focused)
  const setFocus = useKeyboardLessonStore((state) => state.setFocus)
  const setActions = useKeyboardLessonStore((state) => state.setActions)
  const reset = useKeyboardLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  useEffect(() => {
    const releaseFocus = () => {
      if (document.activeElement === element) element?.blur()
      setFocus(false)
    }
    window.addEventListener('blur', releaseFocus)
    return () => window.removeEventListener('blur', releaseFocus)
  }, [element, setFocus])
  return <div ref={setElement} tabIndex={0} role='group' aria-label={t('keyboardUI.scene')} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onPointerDown={() => element?.focus()} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-500'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} />{focused && element ? <KeyboardControls map={keyMap} domElement={element} onChange={(_, __, state) => setActions({ ...state })}><KeyboardPlayer /></KeyboardControls> : <IdlePlayer />}</Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('keyboardUI.scale')}</span></div>
}

// The panel shows named actions and measured position without intercepting keyboard input.
export function KeyboardLessonPanel () {
  const { t } = useTranslation()
  const state = useKeyboardLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('keyboardUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><p className='text-xs text-slate-600'>{t(state.focused ? 'keyboardUI.focused' : 'keyboardUI.unfocused')}</p><div role='group' aria-label={t('ui.liveReadings')} className='space-y-3 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900'><div className='flex flex-wrap gap-2'>{[['W', 'forward'], ['A', 'left'], ['S', 'back'], ['D', 'right']].map(([key, action]) => <span key={key} className={`rounded-md px-2 py-1 font-mono ${state.actions[action] ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-500'}`}>{key} · {action}</span>)}</div><p>{t('keyboardUI.position')} <span className='font-mono'>{state.position.join(' / ')} m</span></p></div><p className='text-xs leading-6 text-slate-500'>{t('keyboardUI.hint')}</p></section>
}
