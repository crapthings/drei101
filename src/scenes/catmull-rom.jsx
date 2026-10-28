import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { CatmullRomLine, Line } from '@react-three/drei'
import { Button, Field, Label, Select, Switch } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The lesson store shares path shape, interpolation and sampling settings.
export const useCatmullStore = create((set) => ({ y: 2, closed: false, curveType: 'centripetal', tension: 0.5, segments: 48, setValue: (key, value) => set({ [key]: value }), reset: () => set({ y: 2, closed: false, curveType: 'centripetal', tension: 0.5, segments: 48 }) }))

// The scene displays an interpolated curve and its four editable reference points.
function CatmullScene () {
  const { y, closed, curveType, tension, segments } = useCatmullStore()
  const points = [[-3, -1, 0], [-1, y, 0], [1, -1.5, 0], [3, 1, 0]]
  return <><ResponsiveFraming halfWidth={3.4} minimumDistance={8} frontDepth={0.15} /><color attach='background' args={['#eef2ff']} /><Line points={closed ? [...points, points[0]] : points} color='#a5b4fc' lineWidth={1} /><CatmullRomLine points={points} closed={closed} curveType={curveType} tension={tension} segments={segments} color='#4f46e5' lineWidth={4} />{points.map((point, index) => <mesh key={index} position={point}><sphereGeometry args={[0.09, 16, 16]} /><meshBasicMaterial color={index === 1 ? '#f59e0b' : '#4f46e5'} /></mesh>)}</>
}

// The canvas resets the path when the lesson is entered or left.
export default function CatmullDemo () {
  const { t } = useTranslation()
  const reset = useCatmullStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('catmullUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><CatmullScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('catmullUI.legend')}</span></div>
}

// The panel adjusts interpolation, closure, waypoint height and sampling.
export function CatmullPanel () {
  const { t } = useTranslation()
  const state = useCatmullStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('catmullUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><Field className='flex items-center justify-between gap-3'><Label className='text-xs text-slate-600'>{t('catmullUI.closed')}</Label><Switch checked={state.closed} onChange={(value) => state.setValue('closed', value)} className='group inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field><label className='block space-y-2 text-xs text-slate-600'><span>{t('catmullUI.curveType')}</span><Select value={state.curveType} onChange={(event) => state.setValue('curveType', event.target.value)} className='block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500'><option value='centripetal'>centripetal</option><option value='chordal'>chordal</option><option value='catmullrom'>catmullrom</option></Select></label>{[['y', -3, 3, 0.1], ['segments', 4, 100, 1], ['tension', 0, 1, 0.05]].map(([key, min, max, step]) => <label key={key} className={`block space-y-3 text-xs text-slate-600 ${key === 'tension' && state.curveType !== 'catmullrom' ? 'opacity-50' : ''}`}><span className='flex justify-between gap-3'><span>{t(`catmullUI.${key}`)}</span><span className='font-mono'>{key === 'segments' ? state[key] : state[key].toFixed(2)}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} disabled={key === 'tension' && state.curveType !== 'catmullrom'} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='text-xs leading-6 text-slate-500'>{t('catmullUI.hint')}</p></section>
}
