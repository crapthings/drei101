import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { PivotControls } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The lesson store shares pivot settings and decomposed drag results with the panel.
export const usePivotLessonStore = create((set) => ({
  automatic: true,
  offsetPivot: false,
  limited: false,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  dragging: false,
  revision: 0,
  setValue: (key, value) => set({ [key]: value }),
  setLimited: (limited) => set((state) => ({ limited, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], dragging: false, revision: state.revision + 1 })),
  reset: () => set((state) => ({ automatic: true, offsetPivot: false, limited: false, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], dragging: false, revision: state.revision + 1 }))
}))

// The rig applies the local matrix automatically or copies it explicitly in controlled mode.
function PivotRig () {
  const automatic = usePivotLessonStore((state) => state.automatic)
  const offsetPivot = usePivotLessonStore((state) => state.offsetPivot)
  const limited = usePivotLessonStore((state) => state.limited)
  const matrix = useMemo(() => new Matrix4(), [])
  const vectors = useMemo(() => ({ position: new Vector3(), rotation: new Quaternion(), scale: new Vector3(), euler: new Euler() }), [])
  const onDrag = (local) => {
    if (!automatic) matrix.copy(local)
    local.decompose(vectors.position, vectors.rotation, vectors.scale)
    vectors.euler.setFromQuaternion(vectors.rotation)
    const round = (value) => Math.round(value * 100) / 100
    usePivotLessonStore.setState({ position: vectors.position.toArray().map(round), rotation: [vectors.euler.x, vectors.euler.y, vectors.euler.z].map((value) => round(value * 180 / Math.PI)), scale: vectors.scale.toArray().map(round) })
  }
  return <PivotControls matrix={matrix} autoTransform={automatic} offset={offsetPivot ? [0.8, 0, 0] : [0, 0, 0]} translationLimits={limited ? [[-0.5, 0.5], undefined, undefined] : undefined} scale={1.4} depthTest={false} onDrag={onDrag} onDragStart={() => usePivotLessonStore.getState().setValue('dragging', true)} onDragEnd={() => usePivotLessonStore.getState().setValue('dragging', false)}><mesh><boxGeometry args={[1.5, 1, 1]} /><meshStandardMaterial color='#6366f1' /></mesh></PivotControls>
}

// The scene remounts the rig on reset to restore the matrix and all handles.
function PivotScene () {
  const revision = usePivotLessonStore((state) => state.revision)
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><gridHelper args={[10, 10, '#a5b4fc', '#c7d2fe']} position={[0, -1, 0]} /><PivotRig key={revision} /></>
}

// The canvas releases its scene and resets the lesson state on exit.
export default function PivotDemo () {
  const { t } = useTranslation()
  const reset = usePivotLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('pivotUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [4, 3, 7], fov: 50 }} dpr={[1, 2]}><PivotScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('pivotUI.scaleUnit')}</span></div>
}

// The panel exposes the pivot position, matrix mode and actual local transform.
export function PivotPanel () {
  const { t } = useTranslation()
  const state = usePivotLessonStore()
  const toggle = (key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`pivotUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => key === 'limited' ? state.setLimited(value) : state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='font-mono text-xs'>PivotControls</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{toggle('automatic')}{toggle('offsetPivot')}{toggle('limited')}<div role='group' aria-label={t('ui.liveReadings')} className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-900'><p>{t('pivotUI.position')} <span className='font-mono'>{state.position.join(' / ')} m</span></p><p>{t('pivotUI.rotation')} <span className='font-mono'>{state.rotation.join(' / ')}°</span></p><p>{t('pivotUI.scale')} <span className='font-mono'>{state.scale.join(' / ')}</span></p><p>{t(state.dragging ? 'pivotUI.dragging' : 'pivotUI.idle')}</p></div><p className='text-xs leading-6 text-slate-500'>{t('pivotUI.hint')}</p></section>
}
