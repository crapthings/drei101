import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Facemesh, FacemeshDatas, FacemeshEyeDefaults, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The built-in sample supplies landmarks and blendshape categories without a camera.
const sample = FacemeshDatas.SAMPLE_FACELANDMARKER_RESULT

// The store controls eye direction, debugging helpers and wireframe rendering.
export const useFaceMeshLessonStore = create((set) => ({ gaze: 0, debug: true, wireframe: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ gaze: 0, debug: true, wireframe: true }) }))

// The scene changes the sample's eye blendshapes while preserving the original data.
function FaceScene () {
  const { gaze, debug, wireframe } = useFaceMeshLessonStore()
  const blendshapes = useMemo(() => {
    const categories = sample.faceBlendshapes[0].categories.map((entry) => ({ ...entry }))
    const { left, right } = FacemeshEyeDefaults.blendshapes
    categories[left[0]].score = Math.max(0, gaze)
    categories[left[1]].score = Math.max(0, -gaze)
    categories[right[0]].score = Math.max(0, -gaze)
    categories[right[1]].score = Math.max(0, gaze)
    return { ...sample.faceBlendshapes[0], categories }
  }, [gaze])
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-4, 2, 3]} intensity={0.8} /><Facemesh rotation-z={Math.PI} points={sample.faceLandmarks[0]} faceBlendshapes={blendshapes} width={2.5} depth={0} eyes debug={debug}><meshStandardMaterial color='#6366f1' wireframe={wireframe} side={2} /></Facemesh><OrbitControls makeDefault minDistance={3} maxDistance={12} /></>
}

// The canvas uses bundled sample data and never requests camera access.
export default function FaceMeshDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useFaceMeshLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('faceMeshUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}><FaceScene /></Canvas></div>
}

// The panel exposes the sample's size and the eye helpers used by Facemesh.
export function FaceMeshPanel () {
  const { t } = useTranslation()
  const state = useFaceMeshLessonStore()
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('faceMeshUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-2 text-xs text-slate-600'><span className='flex justify-between'><span>{t('faceMeshUI.gaze')}</span><span className='font-mono'>{state.gaze}</span></span><input type='range' min='-1' max='1' step='0.1' value={state.gaze} onChange={(event) => state.setValue('gaze', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2' /></label>{['debug', 'wireframe'].map((key) => <Button key={key} aria-pressed={state[key]} onClick={() => state.setValue(key, !state[key])} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t(`faceMeshUI.${key}`)}: {t(state[key] ? 'faceMeshUI.on' : 'faceMeshUI.off')}</Button>)}<div className='space-y-1 rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-700'><p>{t('faceMeshUI.points')}: {sample.faceLandmarks[0].length}</p><p>{t('faceMeshUI.triangles')}: {FacemeshDatas.TRIANGULATION.length / 3}</p><p>{t('faceMeshUI.eyePoints')}: {FacemeshEyeDefaults.contourLandmarks.left.length} / {FacemeshEyeDefaults.contourLandmarks.right.length}</p></div><p className='text-xs leading-6 text-slate-500'>{t('faceMeshUI.hint')}</p></section>
}
