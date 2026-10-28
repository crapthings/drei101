import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, MotionPathControls, useMotion } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { CubicBezierCurve3, Vector3 } from 'three'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares the target progress and measured motion data with the panel.
export const useMotionLessonStore = create((set) => ({
  target: 0,
  controlled: true,
  loop: false,
  focus: false,
  movingFocus: false,
  slow: false,
  offset: 0,
  point: [0, 0, 0],
  tangent: [0, 0, 0],
  facing: [0, 0, 1],
  focusPosition: null,
  objectName: '',
  setValue: (key, value) => set({ [key]: value }),
  reset: () => set({ target: 0, controlled: true, loop: false, focus: false, movingFocus: false, slow: false })
}))

// The observer can set the hook's mutable target and samples its real path state.
function MotionObserver () {
  const motion = useMotion()
  const direction = useMemo(() => new Vector3(), [])
  const focusPositionVector = useMemo(() => new Vector3(), [])
  useFrame(() => {
    const { target, controlled, offset, point, tangent, facing, focusPosition, objectName } = useMotionLessonStore.getState()
    if (!controlled) motion.current = target
    const round = (value) => Math.round(value * 100) / 100
    motion.object.current?.getWorldDirection(direction)
    const focusTarget = Array.isArray(motion.focus) ? motion.focus : motion.focus?.current?.getWorldPosition(focusPositionVector).toArray()
    const values = { offset: round(motion.offset), point: motion.point.toArray().map(round), tangent: motion.tangent.toArray().map(round), facing: direction.toArray().map(round), focusPosition: focusTarget ? focusTarget.map(round) : null, objectName: motion.object.current?.name || '' }
    if (JSON.stringify(values) !== JSON.stringify({ offset, point, tangent, facing, focusPosition, objectName })) {
      useMotionLessonStore.setState(values)
    }
  })
  return null
}

// The mover follows a visible cubic curve while the camera stays fixed.
function MotionScene () {
  const [object, setObject] = useState(null)
  const objectRef = useMemo(() => ({ current: object }), [object])
  const target = useMotionLessonStore((state) => state.target)
  const controlled = useMotionLessonStore((state) => state.controlled)
  const loop = useMotionLessonStore((state) => state.loop)
  const focus = useMotionLessonStore((state) => state.focus)
  const movingFocus = useMotionLessonStore((state) => state.movingFocus)
  const focusRef = useRef(null)
  const slow = useMotionLessonStore((state) => state.slow)
  const focusPoint = useMemo(() => [0, 2.4, 0], [])
  useFrame(({ clock }) => { if (focusRef.current) focusRef.current.position.x = movingFocus ? Math.sin(clock.elapsedTime) * 1.5 : 0 })
  useEffect(() => { if (object && !focus) object.rotation.set(0, 0, 0) }, [object, focus])
  const curve = useMemo(() => new CubicBezierCurve3(new Vector3(-3, -1, 0), new Vector3(-2, 2.5, 0), new Vector3(2, -2.5, 0), new Vector3(3, 1, 0)), [])
  const curves = useMemo(() => [curve], [curve])
  const points = useMemo(() => curve.getPoints(100), [curve])
  return <><ResponsiveFraming halfWidth={3.55} minimumDistance={9} frontDepth={0.55} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><Line points={points} color='#a5b4fc' lineWidth={3} /><mesh ref={focusRef} visible={focus} position={focusPoint}><sphereGeometry args={[0.12, 16, 16]} /><meshBasicMaterial color='#f59e0b' /></mesh><mesh ref={setObject} name='path-cube'><boxGeometry args={[0.65, 0.65, 0.65]} /><meshStandardMaterial color='#4f46e5' /><mesh position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.16, 0.3, 16]} /><meshBasicMaterial color='#fbbf24' /></mesh></mesh>{object && <MotionPathControls curves={curves} object={objectRef} loop={loop} focus={focus ? (movingFocus ? focusRef : focusPoint) : undefined} offset={controlled ? target : undefined} damping={slow ? 0.8 : 0.25}><MotionObserver /></MotionPathControls>}</>
}

// A fresh scene releases the path controller when changing lesson routes.
export default function MotionDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useMotionLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('motionUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}><MotionScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('motionUI.scale')}</span></div>
}

// The panel adjusts target progress and compares it with damped motion values.
export function MotionPanel () {
  const { t } = useTranslation()
  const state = useMotionLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('motionUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('motionUI.controlled')}</Label><Switch checked={state.controlled} onChange={(value) => state.setValue('controlled', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('motionUI.loop')}</Label><Switch checked={state.loop} onChange={(value) => state.setValue('loop', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('motionUI.focus')}</Label><Switch checked={state.focus} onChange={(value) => state.setValue('focus', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><Field disabled={!state.focus} className='flex items-center justify-between gap-3 data-disabled:opacity-50'><Label className='text-xs text-slate-600'>{t('motionUI.movingFocus')}</Label><Switch checked={state.movingFocus} onChange={(value) => state.setValue('movingFocus', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('motionUI.slow')}</Label><Switch checked={state.slow} onChange={(value) => state.setValue('slow', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('motionUI.target')}</span><span className='font-mono'>{state.target.toFixed(2)}</span></span><input type='range' min='0' max='1' step='0.01' value={state.target} onChange={(event) => state.setValue('target', Number(event.target.value))} className='w-full accent-indigo-600' /></label><div role='group' aria-label={t('motionUI.readings')} className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-900'><p>object: <span className='font-mono'>{state.objectName || '—'}</span></p><p>offset: <span className='font-mono'>{state.offset.toFixed(2)}</span></p><p>point: <span className='font-mono'>{state.point.join(' / ')} m</span></p><p>tangent: <span className='font-mono'>{state.tangent.join(' / ')}</span></p><p>{t('motionUI.focusPosition')}: <span className='font-mono'>{state.focusPosition ? state.focusPosition.join(' / ') + ' m' : '—'}</span></p><p>{t('motionUI.facing')}: <span className='font-mono'>{state.facing.join(' / ')}</span></p></div><p className='text-xs leading-6 text-slate-500'>{t('motionUI.hint')}</p>{state.controlled && !state.loop && <p className='rounded-lg bg-amber-50 p-3 text-xs leading-6 text-amber-900'>{t('motionUI.endpointNote')}</p>}</section>
}
