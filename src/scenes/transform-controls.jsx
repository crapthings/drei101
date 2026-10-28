import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { TransformControls } from '@react-three/drei'
import { Button, Field, Label, Radio, RadioGroup, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// Shared controls and measured local transforms keep the panel and scene synchronized.
export const useTransformLessonStore = create((set) => ({
  mode: 'translate',
  snap: false,
  local: false,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  revision: 0,
  setValue: (key, value) => set({ [key]: value }),
  reset: () => set((state) => ({ mode: 'translate', snap: false, local: false, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], revision: state.revision + 1 }))
}))

// The controller reports the actual attached group's local position, Euler rotation and scale.
function TransformScene () {
  const controls = useRef(null)
  const mode = useTransformLessonStore((state) => state.mode)
  const snap = useTransformLessonStore((state) => state.snap)
  const local = useTransformLessonStore((state) => state.local)
  const revision = useTransformLessonStore((state) => state.revision)
  const update = () => {
    const object = controls.current?.object
    if (!object) return
    const round = (value) => Math.round(value * 100) / 100
    useTransformLessonStore.setState({ position: object.position.toArray().map(round), rotation: [object.rotation.x, object.rotation.y, object.rotation.z].map((value) => round(value * 180 / Math.PI)), scale: object.scale.toArray().map(round) })
  }
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><gridHelper args={[10, 10, '#a5b4fc', '#c7d2fe']} position={[0, -1, 0]} /><TransformControls key={revision} ref={controls} mode={mode} space={local ? 'local' : 'world'} translationSnap={snap ? 0.5 : null} rotationSnap={snap ? Math.PI / 12 : null} scaleSnap={snap ? 0.25 : null} onObjectChange={update}><mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='#6366f1' /></mesh></TransformControls></>
}

// The lesson canvas detaches controls and resets its state when the route is left.
export default function TransformDemo () {
  const { t } = useTranslation()
  const reset = useTransformLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('transformUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [4, 3, 7], fov: 50 }} dpr={[1, 2]}><TransformScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('transformUI.scaleUnit')}</span></div>
}

// A radio group selects the gizmo mode and the panel reports actual object transforms.
export function TransformPanel () {
  const { t } = useTranslation()
  const state = useTransformLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='font-mono text-xs'>TransformControls</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><RadioGroup value={state.mode} onChange={(value) => state.setValue('mode', value)} aria-label={t('transformUI.mode')} className='grid grid-cols-3 gap-1'>{['translate', 'rotate', 'scale'].map((mode) => <Radio key={mode} value={mode} className='cursor-pointer rounded-lg bg-slate-100 px-2 py-2 text-center text-xs text-slate-600 data-checked:bg-indigo-600 data-checked:text-white focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(`transformUI.${mode}`)}</Radio>)}</RadioGroup><Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('transformUI.snap')}</Label><Switch checked={state.snap} onChange={(value) => state.setValue('snap', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('transformUI.local')}</Label><Switch checked={state.local} onChange={(value) => state.setValue('local', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><div role='group' aria-label={t('ui.liveReadings')} className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-900'><p>{t('transformUI.position')} <span className='font-mono'>{state.position.join(' / ')} m</span></p><p>{t('transformUI.rotation')} <span className='font-mono'>{state.rotation.join(' / ')}°</span></p><p>{t('transformUI.scale')} <span className='font-mono'>{state.scale.join(' / ')}</span></p></div><p className='text-xs leading-6 text-slate-500'>{t('transformUI.hint')}</p></section>
}
