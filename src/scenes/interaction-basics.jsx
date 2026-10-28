import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CycleRaycast, DragControls, useCursor } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { Matrix4 } from 'three'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// Interaction state exposes actual hover, hit and drag results to the lesson panel.
export const useInteractionStore = create((set) => ({
  hovered: false,
  cursor: 'auto',
  focused: false,
  hits: [],
  current: null,
  clicked: null,
  position: [0, 0, 0],
  dragging: false,
  limited: true,
  automatic: true,
  revision: 0,
  setValue: (key, value) => set({ [key]: value }),
  reset: () => set((state) => ({ hovered: false, cursor: 'auto', focused: false, hits: [], current: null, clicked: null, position: [0, 0, 0], dragging: false, limited: true, automatic: true, revision: state.revision + 1 }))
}))

// A canvas-local cursor communicates hover without changing the rest of the document.
function CursorObject () {
  const canvas = useThree((state) => state.gl.domElement)
  const hovered = useInteractionStore((state) => state.hovered)
  const setValue = useInteractionStore((state) => state.setValue)
  useCursor(hovered, 'pointer', 'auto', canvas)
  useEffect(() => { setValue('cursor', canvas.style.cursor || 'auto') }, [canvas, hovered, setValue])
  useEffect(() => () => setValue('hovered', false), [setValue])
  return <mesh onPointerOver={(event) => { event.stopPropagation(); setValue('hovered', true) }} onPointerOut={() => setValue('hovered', false)} onClick={() => setValue('clicked', 'A')}><boxGeometry args={[1.8, 1.8, 1.8]} /><meshStandardMaterial color={hovered ? '#a78bfa' : '#6366f1'} /></mesh>
}

// The guard waits for a real pointer move before Drei replays that event on C.
function FocusedCycleRaycast ({ canvas, onChanged }) {
  const ready = useRef(false)
  useEffect(() => {
    const move = (event) => { if (event.target === canvas) ready.current = true }
    const guard = (event) => {
      if (document.activeElement === canvas && (event.keyCode || event.which) === 67 && !ready.current) event.stopPropagation()
    }
    document.addEventListener('pointermove', move, true)
    document.addEventListener('keydown', guard, true)
    return () => {
      document.removeEventListener('pointermove', move, true)
      document.removeEventListener('keydown', guard, true)
    }
  }, [canvas])
  return <CycleRaycast keyCode={67} scroll={false} preventDefault={false} onChanged={onChanged} />
}

// Keyboard cycling is mounted only while the canvas has focus, preserving normal page shortcuts.
function CycleObjects () {
  const canvas = useThree((state) => state.gl.domElement)
  const { t } = useTranslation()
  const focused = useInteractionStore((state) => state.focused)
  const setValue = useInteractionStore((state) => state.setValue)
  const onChanged = (hits, index) => {
    const names = hits.map((hit) => hit.object.userData.label).filter(Boolean)
    useInteractionStore.setState({ hits: names, current: names[index] || null })
  }
  useEffect(() => {
    canvas.setAttribute('aria-label', t('interactionUI.scene'))
  }, [canvas, t])
  useEffect(() => {
    canvas.tabIndex = 0
    const focus = () => setValue('focused', true)
    const blur = () => useInteractionStore.setState({ focused: false, current: null, hits: [] })
    canvas.addEventListener('focus', focus)
    canvas.addEventListener('blur', blur)
    return () => {
      canvas.removeEventListener('focus', focus)
      canvas.removeEventListener('blur', blur)
      blur()
    }
  }, [canvas, setValue])
  return (
    <>
      {focused && <FocusedCycleRaycast canvas={canvas} onChanged={onChanged} />}
      {[['A', 0.5, '#4f46e5'], ['B', 0, '#a78bfa'], ['C', -0.5, '#38bdf8']].map(([label, z, color]) => <mesh key={label} position={[0, 0, z]} userData={{ label }} onPointerDown={(event) => { event.stopPropagation(); canvas.focus() }} onPointerOver={(event) => { event.stopPropagation(); setValue('current', label) }} onClick={(event) => { event.stopPropagation(); setValue('clicked', label) }}><planeGeometry args={[2.6, 2.6]} /><meshBasicMaterial color={color} transparent opacity={0.48} depthWrite={false} /></mesh>)}
    </>
  )
}

// The drag matrix can be applied automatically or copied explicitly by the change callback.
function DraggableObject () {
  const matrix = useMemo(() => new Matrix4(), [])
  const automatic = useInteractionStore((state) => state.automatic)
  const limited = useInteractionStore((state) => state.limited)
  const setValue = useInteractionStore((state) => state.setValue)
  return <DragControls matrix={matrix} autoTransform={automatic} axisLock='z' dragLimits={limited ? [[-1.4, 1.4], [-1.4, 1.4], [0, 0]] : undefined} onHover={(value) => setValue('hovered', value)} onDragStart={() => setValue('dragging', true)} onDrag={(local) => { if (!automatic) matrix.copy(local); setValue('position', [local.elements[12], local.elements[13], local.elements[14]].map((value) => Number(value.toFixed(2)))) }} onDragEnd={() => setValue('dragging', false)}><mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='#6366f1' /></mesh></DragControls>
}

// Each interaction uses a fresh scene while preserving the same camera and scale.
function InteractionScene ({ name }) {
  const revision = useInteractionStore((state) => state.revision)
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><gridHelper args={[10, 10, '#a5b4fc', '#c7d2fe']} position={[0, -2, 0]} />{name === 'useCursor' ? <CursorObject /> : name === 'CycleRaycast' ? <CycleObjects /> : <DraggableObject key={revision} />}</>
}

// A shared panel displays the observable state and only the settings relevant to each export.
export function InteractionPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useInteractionStore()
  const toggle = (key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`interactionUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='font-mono text-xs'>{name}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{name === 'DragControls' && <>{toggle('limited')}{toggle('automatic')}</>}<div role={name === 'DragControls' ? 'group' : 'status'} aria-label={name === 'DragControls' ? t('ui.liveReadings') : undefined} className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-900'>{name === 'DragControls' ? <><p>{t('interactionUI.position')} <span className='font-mono'>{state.position.join(' / ')} m</span></p><p>{t(state.dragging ? 'interactionUI.dragging' : 'interactionUI.idle')}</p></> : name === 'useCursor' ? <><p>{t(state.hovered ? 'interactionUI.hovering' : 'interactionUI.notHovering')}</p><p>{t('interactionUI.cursor')} <span className='font-mono'>{state.cursor}</span></p><p>{t('interactionUI.clicked')} {state.clicked || '—'}</p></> : <><p>{t(state.focused ? 'interactionUI.focused' : 'interactionUI.unfocused')}</p><p>{t('interactionUI.hits')} {state.hits.join(' → ') || '—'}</p><p>{t('interactionUI.current')} {state.current || '—'}</p><p>{t('interactionUI.clicked')} {state.clicked || '—'}</p></>}</div><p className='text-xs leading-6 text-slate-500'>{t(`interactionUI.hint.${name}`)}</p></section>
}

// The interaction canvas is scoped to the current route and releases its state on exit.
export default function InteractionDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useInteractionStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('interactionUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 50 }} dpr={[1, 2]}><InteractionScene name={name} /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('interactionUI.scale')}</span></div>
}
