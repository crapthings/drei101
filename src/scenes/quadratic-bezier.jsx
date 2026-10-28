import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, QuadraticBezierLine } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares the editable control point and sampling count.
export const useQuadraticStore = create((set) => ({ x: 0, y: 2, segments: 20, setValue: (key, value) => set({ [key]: value }), reset: () => set({ x: 0, y: 2, segments: 20 }) }))

// The scene contrasts the Bézier curve with its control polygon.
function CurveScene () {
  const { x, y, segments } = useQuadraticStore()
  const start = [-3, -1, 0]
  const mid = [x, y, 0]
  const end = [3, -1, 0]
  return <><ResponsiveFraming halfWidth={3.4} minimumDistance={8} frontDepth={0.15} /><color attach='background' args={['#eef2ff']} /><Line points={[start, mid, end]} color='#a5b4fc' lineWidth={1} /><QuadraticBezierLine start={start} mid={mid} end={end} segments={segments} color='#4f46e5' lineWidth={4} />{[start, mid, end].map((point, index) => <mesh key={index} position={point}><sphereGeometry args={[0.09, 16, 16]} /><meshBasicMaterial color={index === 1 ? '#f59e0b' : '#4f46e5'} /></mesh>)}</>
}

// The canvas resets the experiment when the lesson is entered or left.
export default function QuadraticDemo () {
  const { t } = useTranslation()
  const reset = useQuadraticStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('quadraticUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><CurveScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('quadraticUI.legend')}</span></div>
}

// The panel exposes control-point coordinates and the number of sampled segments.
export function QuadraticPanel () {
  const { t } = useTranslation()
  const state = useQuadraticStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('quadraticUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['x', -3, 3, 0.1], ['y', -3, 3, 0.1], ['segments', 2, 40, 1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`quadraticUI.${key}`)}</span><span className='font-mono'>{key === 'segments' ? state[key] : `${state[key].toFixed(1)} m`}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('quadraticUI.hint')}</p></section>
}
