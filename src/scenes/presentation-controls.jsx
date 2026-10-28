import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls } from '@react-three/drei'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// Shared presentation settings and observed angles connect the scene to its panel.
export const usePresentationStore = create((set) => ({
  snap: false,
  limited: true,
  tilted: false,
  angles: [0, 0, 0],
  revision: 0,
  setValue: (key, value) => set({ [key]: value }),
  reset: () => set((state) => ({ snap: false, limited: true, tilted: false, angles: [0, 0, 0], revision: state.revision + 1 }))
}))

// The asymmetric model makes the direction of the rotating parent visible.
function PresentedObject () {
  const ref = useRef(null)
  useFrame(() => {
    const rotation = ref.current.parent.rotation
    const angles = [rotation.x, rotation.y, rotation.z].map((value) => Math.round(value * 180 / Math.PI))
    const current = usePresentationStore.getState().angles
    if (angles[0] !== current[0] || angles[1] !== current[1] || angles[2] !== current[2]) usePresentationStore.getState().setValue('angles', angles)
  })
  return <group ref={ref}><mesh><boxGeometry args={[2, 1.4, 1]} /><meshStandardMaterial color='#6366f1' /></mesh><mesh position={[0.55, 0.25, 0.55]}><boxGeometry args={[0.45, 0.45, 0.12]} /><meshStandardMaterial color='#fbbf24' /></mesh></group>
}

// The controller rotates its contents while the camera remains fixed.
function PresentationScene () {
  const snap = usePresentationStore((state) => state.snap)
  const limited = usePresentationStore((state) => state.limited)
  const tilted = usePresentationStore((state) => state.tilted)
  const revision = usePresentationStore((state) => state.revision)
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><PresentationControls key={`${revision}-${tilted}`} rotation={[0, 0, tilted ? Math.PI / 6 : 0]} snap={snap} cursor={false} polar={limited ? [-Math.PI / 4, Math.PI / 4] : [-Math.PI, Math.PI]} azimuth={limited ? [-Math.PI / 4, Math.PI / 4] : [-Math.PI, Math.PI]}><PresentedObject /></PresentationControls></>
}

// A dedicated canvas releases the controller on leaving the lesson.
export default function PresentationDemo () {
  const { t } = useTranslation()
  const reset = usePresentationStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('presentationUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><PresentationScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('presentationUI.scale')}</span></div>
}

// The panel changes controller settings and reports measured group rotation.
export function PresentationPanel () {
  const { t } = useTranslation()
  const state = usePresentationStore()
  const toggle = (key) => <Field key={key} className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t(`presentationUI.${key}`)}</Label><Switch checked={state[key]} onChange={(value) => state.setValue(key, value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='font-mono text-xs'>PresentationControls</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{toggle('snap')}{toggle('limited')}{toggle('tilted')}<div role='group' aria-label={t('ui.liveReadings')} className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-900'><p>{t('presentationUI.angles')} <span className='font-mono'>{state.angles.join('° / ')}°</span></p></div><p className='text-xs leading-6 text-slate-500'>{t('presentationUI.hint')}</p></section>
}
