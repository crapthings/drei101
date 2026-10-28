import { useEffect, useRef } from 'react'
import { Canvas, addAfterEffect, useFrame, useThree } from '@react-three/fiber'
import { Stats, StatsGl } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store controls scene load and reports the renderer's actual draw calls.
export const useStatsLessonStore = create((set) => ({ count: 100, calls: 0, setCount: (count) => set({ count }), report: (calls) => set((state) => state.calls === calls ? state : { calls }), reset: () => set({ count: 100, calls: 0 }) }))

// The observer samples the renderer's call count after a rendered frame.
function StatsObserver () {
  const gl = useThree((state) => state.gl)
  const report = useStatsLessonStore((state) => state.report)
  useEffect(() => { let last = 0; return addAfterEffect((time) => { if (time - last > 500) { last = time; report(gl.info.render.calls) } }) }, [gl, report])
  return null
}

// The scene renders many separate objects to produce a visible change in draw calls.
function StatsScene () {
  const group = useRef()
  const count = useStatsLessonStore((state) => state.count)
  useFrame((_, delta) => { group.current.rotation.y += delta * 0.2 })
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-3, 2, -4]} intensity={0.8} /><group ref={group}>{Array.from({ length: count }, (_, i) => <mesh key={i} position={[(i % 10 - 4.5) * 0.42, (Math.floor(i / 10) % 10 - 4.5) * 0.42, (Math.floor(i / 100) - 2) * 0.42]}><boxGeometry args={[0.28, 0.28, 0.28]} /><meshStandardMaterial color={i % 2 ? '#818cf8' : '#f97316'} /></mesh>)}</group><StatsObserver /></>
}

// The canvas mounts the selected monitoring widget inside its own overlay container.
export default function StatsLessonDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const parent = useRef()
  const reset = useStatsLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('statsUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><div ref={parent} className='absolute left-3 top-3 z-10' /><Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 2]}><StatsScene />{name === 'Stats' ? <Stats parent={parent} className='!absolute !left-0 !top-0' /> : <StatsGl parent={parent} />}</Canvas></div>
}

// The panel adjusts the number of separate meshes and shows measured draw calls.
export function StatsLessonPanel () {
  const { t } = useTranslation()
  const { count, calls, setCount, reset } = useStatsLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('statsUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('statsUI.count')}</span><span>{count}</span></span><input type='range' min='20' max='500' step='20' value={count} onChange={(event) => setCount(Number(event.target.value))} className='w-full accent-indigo-600' /></label><p role='status' className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('statsUI.calls')}: {calls}</p><p className='text-xs leading-6 text-slate-500'>{t('statsUI.hint')}</p></section>
}
