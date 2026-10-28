import { memo, useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Scroll, ScrollControls, useScroll } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The lesson store shares settings and measured scroll values with the control panel.
export const useScrollLessonStore = create((set) => ({
  horizontal: false,
  slow: false,
  target: 0,
  offset: 0,
  delta: 0,
  range: 0,
  curve: 0,
  visible: false,
  revision: 0,
  setValue: (key, value) => set({ [key]: value }),
  reset: () => set((state) => ({ horizontal: false, slow: false, target: 0, offset: 0, delta: 0, range: 0, curve: 0, visible: false, revision: state.revision + 1 }))
}))

// The observer publishes scroll values only when their displayed precision changes.
function ScrollObserver () {
  const scroll = useScroll()
  const events = useThree((state) => state.events)
  const previous = useRef('')
  const previousScroll = useRef(null)
  const { t } = useTranslation()
  useLayoutEffect(() => {
    if (previousScroll.current && previousScroll.current.el === scroll.el) {
      scroll.offset = previousScroll.current.offset
      scroll.delta = previousScroll.current.delta
    }
    previousScroll.current = scroll
  }, [scroll])
  useEffect(() => {
    scroll.el.tabIndex = 0
    scroll.el.setAttribute('aria-label', t('scrollUI.scrollArea'))
  }, [scroll, t])
  useEffect(() => {
    if (scroll.el.isConnected && events.connected !== scroll.el) events.connect?.(scroll.el)
  }, [events, scroll])
  useFrame(() => {
    const round = (value) => Math.round(value * 100) / 100
    const horizontal = useScrollLessonStore.getState().horizontal
    const extent = horizontal ? scroll.el.scrollWidth - scroll.el.clientWidth : scroll.el.scrollHeight - scroll.el.clientHeight
    const position = horizontal ? scroll.el.scrollLeft : scroll.el.scrollTop
    const values = { target: round(extent > 0 ? position / extent : 0), offset: round(scroll.offset), delta: Math.round(scroll.delta * 10000) / 10000, range: round(scroll.range(0.25, 0.5)), curve: round(scroll.curve(0.25, 0.5)), visible: scroll.visible(0.25, 0.5) }
    const next = JSON.stringify(values)
    if (next !== previous.current) {
      previous.current = next
      useScrollLessonStore.setState(values)
    }
  })
  return null
}

// Three one-meter objects and corresponding HTML labels occupy consecutive viewports.
function ScrollContent () {
  const { width, height } = useThree((state) => state.viewport)
  const size = useThree((state) => state.size)
  const horizontal = useScrollLessonStore((state) => state.horizontal)
  const { t } = useTranslation()
  return <><Scroll>{['#4f46e5', '#a78bfa', '#38bdf8'].map((color, index) => <mesh key={color} position={horizontal ? [width * index, 0, 0] : [0, -height * index, 0]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={color} /></mesh>)}</Scroll><Scroll html>{[0, 1, 2].map((index) => <div key={index} className='absolute whitespace-nowrap rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm' style={{ left: horizontal ? size.width * index + 24 : 24, top: horizontal ? 24 : size.height * index + 24 }}>{t('scrollUI.page', { number: index + 1 })}</div>)}</Scroll></>
}

// Scene settings update inside the canvas without reconnecting its outer event source.
function ScrollScene () {
  const horizontal = useScrollLessonStore((state) => state.horizontal)
  const slow = useScrollLessonStore((state) => state.slow)
  const revision = useScrollLessonStore((state) => state.revision)
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><ScrollControls key={`${revision}-${horizontal}`} pages={3} horizontal={horizontal} damping={slow ? 0.8 : 0.25}><ScrollObserver /><ScrollContent /></ScrollControls></>
}

// Memoization keeps telemetry updates from resetting the canvas event connection.
const ScrollCanvas = memo(function ScrollCanvas () {
  return <Canvas camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 50 }} dpr={[1, 2]}><ScrollScene /></Canvas>
})

// Each lesson starts with fresh scroll settings and releases them when it is left.
export default function ScrollLessonDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useScrollLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('scrollUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><ScrollCanvas /></div>
}

// The panel compares container progress and hook measurements with adjustable settings.
export function ScrollLessonPanel () {
  const { t } = useTranslation()
  const state = useScrollLessonStore()
  const toggle = (key) => <Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`scrollUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('scrollUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{toggle('horizontal')}{toggle('slow')}<div role='group' aria-label={t('ui.liveReadings')} className='space-y-2 rounded-lg bg-indigo-50 p-3 font-mono text-xs leading-6 text-indigo-900'><p>{t('scrollUI.target')}: {state.target.toFixed(2)}</p><p>offset: {state.offset.toFixed(2)}</p><p>delta: {state.delta.toFixed(4)}</p><p>range(0.25, 0.5): {state.range.toFixed(2)}</p><p>curve(0.25, 0.5): {state.curve.toFixed(2)}</p><p>visible(0.25, 0.5): {String(state.visible)}</p></div><p className='text-xs leading-6 text-slate-500'>{t('scrollUI.hint')}</p></section>
}
