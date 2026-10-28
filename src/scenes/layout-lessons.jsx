import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { BBAnchor, Center, Resize } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store shares the dimensions and comparison settings used by the layout lessons.
export const useLayoutStore = create((set) => ({ width: 2, height: 1, anchorX: 1, anchorY: 1, enabled: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ width: 2, height: 1, anchorX: 1, anchorY: 1, enabled: true }) }))

// The colored model intentionally has an offset origin to make centering visible.
function Model ({ width, height, offset = false }) {
  return <mesh position={offset ? [1, 0.5, 0] : [0, 0, 0]}><boxGeometry args={[width, height, 0.7]} /><meshStandardMaterial color='#6366f1' /></mesh>
}

// A small orange marker makes reference origins and bounding-box anchors visible.
function Marker () {
  return <mesh renderOrder={1000}><sphereGeometry args={[0.11, 20, 20]} /><meshBasicMaterial color='#f59e0b' depthTest={false} depthWrite={false} /></mesh>
}

// The scene compares original geometry with the chosen bounding-box operation.
function LayoutScene () {
  const { name } = useParams()
  const { width, height, anchorX, anchorY, enabled } = useLayoutStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={4.5} minimumDistance={10} frontDepth={1} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, -2, 3]} intensity={0.8} />{name === 'BBAnchor'
    ? <group><Model width={width} height={height} /><BBAnchor anchor={[anchorX, anchorY, 1]}><Marker /></BBAnchor></group>
    : <><group position={[-2.5, 0, 0]}><Marker /><Model width={width} height={height} offset={name === 'Center'} /></group><group position={[2.5, 0, 0]}><Marker />{name === 'Center'
      ? <Center disable={!enabled} cacheKey={`${width}-${height}`}><Model width={width} height={height} offset /></Center>
      : enabled ? <Resize key={`${width}-${height}`}><Model width={width} height={height} /></Resize> : <Model width={width} height={height} />}</group></>}</>
}

// The canvas resets the experiment when entering or leaving a layout lesson.
export default function LayoutDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useLayoutStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('layoutUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}><LayoutScene /></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between gap-2 text-xs text-indigo-700'>{name === 'BBAnchor' ? <span className='rounded-full bg-white/90 px-3 py-1.5'>{t('layoutUI.anchorLegend')}</span> : <><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('layoutUI.original')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('layoutUI.result')}</span></>}</div></div>
}

// The panel changes model dimensions and either the operation or anchor position.
export function LayoutPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useLayoutStore()
  const fields = name === 'BBAnchor' ? [['width', 0.5, 3, 0.1], ['height', 0.5, 3, 0.1], ['anchorX', -1, 1, 0.1], ['anchorY', -1, 1, 0.1]] : [['width', 0.5, 3, 0.1], ['height', 0.5, 3, 0.1]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('layoutUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`layoutUI.${key}`)}</span><span className='font-mono'>{state[key].toFixed(1)}{key === 'width' || key === 'height' ? ' m' : ''}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{name !== 'BBAnchor' && <Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'layoutUI.enabled' : 'layoutUI.disabled', { name })}</Button>}<p className='text-xs leading-6 text-slate-500'>{t(name === 'BBAnchor' ? 'layoutUI.anchorHint' : 'layoutUI.comparisonHint')}</p></section>
}
