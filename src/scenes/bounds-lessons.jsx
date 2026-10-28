import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Bounds, useBounds } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares the target, model size and request counter with the scene.
export const useFramingStore = create((set) => ({ width: 2, target: 'all', request: 0, setWidth: (width) => set({ width }), focus: (target) => set((state) => ({ target, request: state.request + 1 })), reset: () => set((state) => ({ width: 2, target: 'all', request: state.request + 1 })) }))

// The scene selects an individual object or the entire Bounds group for camera fitting.
function Objects () {
  const bounds = useBounds()
  const left = useRef(null)
  const right = useRef(null)
  const { width, target, request } = useFramingStore()
  const size = useThree((state) => state.size)
  useEffect(() => {
    const object = target === 'left' ? left.current : target === 'right' ? right.current : undefined
    bounds.refresh(object).fit()
  }, [bounds, request, size.width, size.height])
  return <><mesh ref={left} position={[-2.5, 0, 0]}><boxGeometry args={[width, 1.4, 1]} /><meshStandardMaterial color='#6366f1' /></mesh><mesh ref={right} position={[2.5, 0, 0]}><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color='#f59e0b' /></mesh></>
}

// The canvas initializes automatic framing and exposes Bounds context to the objects.
export default function BoundsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useFramingStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('boundsUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} /><Bounds fit observe margin={1.4} maxDuration={0.8}><Objects /></Bounds></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('boundsUI.legend')}</span></div>
}

// The panel changes the model size and requests framing of one or both objects.
export function BoundsPanel () {
  const { t } = useTranslation()
  const { width, target, setWidth, focus, reset } = useFramingStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('boundsUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('boundsUI.width')}</span><span className='font-mono'>{width.toFixed(1)} m</span></span><input type='range' min='0.5' max='4' step='0.1' value={width} onChange={(event) => setWidth(Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><div className='grid gap-2'>{['all', 'left', 'right'].map((item) => <Button key={item} onClick={() => focus(item)} aria-pressed={target === item} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${target === item ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(`boundsUI.${item}`)}</Button>)}</div><p className='text-xs leading-6 text-slate-500'>{t('boundsUI.hint')}</p></section>
}
