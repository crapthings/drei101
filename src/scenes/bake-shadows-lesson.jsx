import { useEffect } from 'react'
import { Canvas, addAfterEffect, useThree } from '@react-three/fiber'
import { BakeShadows, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store controls the caster, shadow updates and observed renderer draw calls.
export const useBakeStore = create((set) => ({ x: 0, baked: false, calls: 0, revision: 0, setValue: (key, value) => set({ [key]: value }), report: (calls) => set((state) => state.calls === calls ? state : { calls }), reset: () => set((state) => ({ x: 0, baked: false, calls: 0, revision: state.revision + 1 })) }))

// The observer samples actual renderer draw calls after frames have rendered.
function DrawCallObserver () {
  const gl = useThree((state) => state.gl)
  const report = useBakeStore((state) => state.report)
  useEffect(() => { let last = 0; return addAfterEffect((time) => { if (time - last > 500) { last = time; report(gl.info.render.calls) } }) }, [gl, report])
  return null
}

// The scene optionally freezes shadow-map updates while the caster remains movable.
function BakeScene () {
  const { x, baked } = useBakeStore()
  return <><color attach='background' args={['#eef2ff']} /><directionalLight castShadow position={[3, 6, 4]} intensity={3} shadow-mapSize={[1024, 1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0003} /><directionalLight position={[-4, 3, -2]} intensity={0.8} /><mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[10, 10]} /><meshStandardMaterial color='#f8fafc' /></mesh><mesh castShadow position={[x, 1, 0]}><boxGeometry args={[1.4, 2, 1.4]} /><meshStandardMaterial color='#6366f1' /></mesh>{baked && <BakeShadows />}<DrawCallObserver /><OrbitControls makeDefault target={[0, 0.8, 0]} minDistance={5} maxDistance={16} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The canvas provides a fresh shadow map whenever the lesson is reset.
export default function BakeShadowsDemo () {
  const { t } = useTranslation()
  const { revision, reset } = useBakeStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('bakeUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas key={revision} shadows camera={{ position: [5, 4, 8], fov: 45 }} dpr={[1, 2]}><BakeScene /></Canvas></div>
}

// The panel compares live and frozen shadows while displaying measured draw calls.
export function BakeShadowsPanel () {
  const { t } = useTranslation()
  const { x, baked, calls, setValue, reset } = useBakeStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('bakeUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('bakeUI.position')}</span><span>{x} m</span></span><input type='range' min='-2.5' max='2.5' step='0.1' value={x} onChange={(event) => setValue('x', Number(event.target.value))} className='w-full accent-indigo-600' /></label><Button aria-pressed={baked} onClick={() => setValue('baked', !baked)} className='w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(baked ? 'bakeUI.frozen' : 'bakeUI.live')}</Button><p role='status' className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('bakeUI.calls')}: {calls}</p><p className='text-xs leading-6 text-slate-500'>{t('bakeUI.hint')}</p></section>
}
