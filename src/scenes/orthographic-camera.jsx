import { Canvas } from '@react-three/fiber'
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { Button, Field, Input, Label } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

// Orthographic experiments preserve their own parameters independently of perspective lessons.
export const useOrthoStore = create((set) => ({
  zoom: 65,
  distance: 8,
  near: 0.1,
  far: 60,
  perspective: false,
  setParameter: (name, value) => set({ [name]: value }),
  reset: () => set({ zoom: 65, distance: 8, near: 0.1, far: 60, perspective: false })
}))

// Equal-size cubes at different depths isolate orthographic size invariance.
function OrthoScene () {
  const { zoom, distance, near, far, perspective } = useOrthoStore()

  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      {perspective
        ? <PerspectiveCamera makeDefault position={[0, 0, distance]} fov={50} near={Math.max(0.01, near)} far={far} />
        : <OrthographicCamera makeDefault position={[0, 0, distance]} zoom={zoom} near={near} far={far} />}
      <directionalLight position={[3, 5, 8]} intensity={3} />
      <directionalLight position={[-3, 2, 0]} intensity={1} color='#c7d2fe' />
      {[[-1.7, 2, '#6366f1'], [0, -2, '#818cf8'], [1.7, -6, '#a5b4fc']].map(([x, z, color]) => (
        <mesh key={z} position={[x, 0, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
      <gridHelper args={[40, 40, '#a5b4fc', '#dce2f5']} position={[0, -1.5, -10]} />
    </>
  )
}

// Labeled controls expose distance-independent sizing and a perspective comparison.
export function OrthographicPanel () {
  const { t } = useTranslation()
  const state = useOrthoStore()
  const fields = [{ name: 'zoom', min: 25, max: 110, step: 1 }, { name: 'distance', min: 4, max: 18, step: 0.1 }, { name: 'near', min: 0, max: 12, step: 0.1 }, { name: 'far', min: 13, max: 60, step: 1 }]

  return (
    <section className='space-y-6 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-sm font-medium'>{t('ui.parameters')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <div className='flex gap-2'>{[false, true].map((value) => <Button key={String(value)} aria-pressed={state.perspective === value} onClick={() => state.setParameter('perspective', value)} className={`flex-1 cursor-pointer rounded-lg border px-2 py-2 text-xs focus-visible:outline-2 ${state.perspective === value ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(value ? 'orthoControls.perspective' : 'orthoControls.orthographic')}</Button>)}</div>
      {fields.map(({ name, min, max, step }) => <Field key={name}><div className='mb-3 flex justify-between text-xs'><Label className='text-slate-600'>{t(name === 'zoom' ? 'orthoControls.zoom' : `ui.${name}`)}</Label><output className='font-mono text-indigo-600'>{state[name]}{name === 'zoom' ? '' : ' m'}</output></div><Input type='range' disabled={name === 'zoom' && state.perspective} min={min} max={max} step={step} value={state[name]} onChange={(event) => state.setParameter(name, Number(event.target.value))} className='h-1 w-full cursor-pointer accent-indigo-600 disabled:opacity-30 focus-visible:outline-2' /></Field>)}
      <p className='text-xs leading-6 text-slate-500'>{t('orthoControls.hint')}</p>
    </section>
  )
}

// A dedicated canvas makes the projection comparison independent of other camera pages.
export default function OrthographicDemo () {
  const { t } = useTranslation()
  return <div role='img' aria-label={t('orthoControls.label')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas dpr={[1, 2]}><OrthoScene /></Canvas><div className='pointer-events-none absolute left-5 top-5 rounded-full border border-indigo-100 bg-white/90 px-3 py-1.5 font-mono text-[11px] text-indigo-700'>1 unit = 1 m · 3 × 1 m³</div></div>
}
