import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CurveModifier, Line } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { CatmullRomCurve3, Vector3 } from 'three'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares the closed curve height and normalized travel offset.
export const useCurveModifierStore = create((set) => ({ height: 1.4, offset: 0, setValue: (key, value) => set({ [key]: value }), reset: () => set({ height: 1.4, offset: 0 }) }))

// The scene bends a subdivided strip along a closed curve and moves it by offset deltas.
function ModifierScene () {
  const { height, offset } = useCurveModifierStore()
  const flow = useRef(null)
  const previousOffset = useRef(0)
  const curve = useMemo(() => new CatmullRomCurve3([new Vector3(-2.2, 0, 0), new Vector3(0, height, 0), new Vector3(2.2, 0, 0), new Vector3(0, -height, 0)], true), [height])
  const path = useMemo(() => curve.getPoints(120), [curve])
  const child = useMemo(() => <mesh><boxGeometry args={[2.4, 0.18, 0.18, 80, 1, 1]} /><meshStandardMaterial color='#4f46e5' roughness={0.4} /></mesh>, [])
  useEffect(() => {
    const modifier = flow.current
    return () => {
      modifier?.splineTexure.dispose()
      modifier?.object3D.traverse((object) => {
        if (object.isMesh) object.material.dispose()
      })
    }
  }, [])
  useFrame(() => {
    if (!flow.current) return
    flow.current.moveAlongCurve(offset - previousOffset.current)
    previousOffset.current = offset
  })
  return <><ResponsiveFraming halfWidth={2.8} minimumDistance={7} frontDepth={0.3} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 5]} intensity={3} /><Line points={path} color='#a5b4fc' lineWidth={2} /><CurveModifier ref={flow} curve={curve}>{child}</CurveModifier></>
}

// The canvas starts with a fresh curve and offset on entry and exit.
export default function CurveModifierDemo () {
  const { t } = useTranslation()
  const reset = useCurveModifierStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('curveModifierUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><ModifierScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('curveModifierUI.legend')}</span></div>
}

// The panel changes the path shape and normalized offset along the closed loop.
export function CurveModifierPanel () {
  const { t } = useTranslation()
  const state = useCurveModifierStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('curveModifierUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['height', 0.8, 2, 0.1], ['offset', 0, 1, 0.01]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`curveModifierUI.${key}`)}</span><span className='font-mono'>{state[key].toFixed(2)}{key === 'height' ? ' m' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('curveModifierUI.hint')}</p></section>
}
