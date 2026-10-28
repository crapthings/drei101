import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { FaceControls, FacemeshDatas, useFaceControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store controls synthetic sample motion and reports actual camera positions.
export const useFaceControlsStore = create((set) => ({ x: 0, y: 0, smooth: 0.25, camera: null, target: null, setValue: (key, value) => set({ [key]: value }), report: (camera, target) => set({ camera, target }), reset: () => set({ x: 0, y: 0, smooth: 0.25, camera: null, target: null }) }))

// The observer reads the FaceControls context from inside its facemesh subtree.
function FaceControlsObserver () {
  const api = useFaceControls()
  const camera = useThree((state) => state.camera)
  const report = useFaceControlsStore((state) => state.report)
  const last = useRef(0)
  useFrame((state) => {
    if (state.clock.elapsedTime - last.current < 0.2) return
    last.current = state.clock.elapsedTime
    const target = api.computeTarget().position
    report(camera.position.toArray().map((n) => n.toFixed(2)), target.toArray().map((n) => n.toFixed(2)))
  })
  return null
}

// The scene moves a sample transformation matrix while FaceControls updates the camera.
function FaceControlScene () {
  const { x, y, smooth } = useFaceControlsStore()
  const result = useMemo(() => {
    const sample = FacemeshDatas.SAMPLE_FACELANDMARKER_RESULT
    const matrix = { ...sample.facialTransformationMatrixes[0], data: [...sample.facialTransformationMatrixes[0].data] }
    matrix.data[12] = x * 80
    matrix.data[13] = -y * 80
    matrix.data[14] = -40
    return { ...sample, facialTransformationMatrixes: [matrix] }
  }, [x, y])
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 2]} intensity={3} /><mesh position={[-1.4, 0.2, -4]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='#6366f1' /></mesh><mesh position={[1.4, 0.2, -5]}><sphereGeometry args={[0.7, 32, 24]} /><meshStandardMaterial color='#f59e0b' /></mesh><mesh position={[0, -1.1, -6]}><boxGeometry args={[6, 0.15, 1]} /><meshStandardMaterial color='#a5b4fc' /></mesh><FaceControls manualDetect faceLandmarkerResult={result} smoothTime={smooth} offset offsetScalar={80} facemesh={{ children: <><meshBasicMaterial visible={false} /><FaceControlsObserver /></> }} /></>
}

// The canvas uses a synthetic pose and never starts video capture.
export default function FaceControlsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useFaceControlsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('faceControlsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 0.5], fov: 50 }} dpr={[1, 2]}><FaceControlScene /></Canvas></div>
}

// The panel changes the input pose and shows the actual camera and computed target.
export function FaceControlsPanel () {
  const { t } = useTranslation()
  const state = useFaceControlsStore()
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('faceControlsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['x', -1, 1, 0.1], ['y', -0.6, 0.6, 0.1], ['smooth', 0, 1, 0.05]].map(([key, min, max, step]) => <label key={key} className='block space-y-2 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`faceControlsUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2' /></label>)}<div aria-live='polite' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800'><p>{t('faceControlsUI.camera')}: <span className='font-mono'>{state.camera?.join(', ') || '—'}</span></p><p>{t('faceControlsUI.target')}: <span className='font-mono'>{state.target?.join(', ') || '—'}</span></p></div><p className='text-xs leading-6 text-slate-500'>{t('faceControlsUI.hint')}</p><a href={`${import.meta.env.BASE_URL}index.html?frame=face-live#/face-live`} target='_blank' rel='noreferrer' className='block rounded-lg border border-indigo-200 px-3 py-2 text-center text-xs text-indigo-700 hover:bg-indigo-50 focus-visible:outline-2'>{t('faceControlsUI.liveOpen')} ↗</a></section>
}
