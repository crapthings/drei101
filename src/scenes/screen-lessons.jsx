import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Billboard, ScreenSpace, ScreenSizer, calculateScaleFactor } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Vector3 } from 'three'

// The store controls camera movement and the size of the screen-space comparison.
export const useScreenStore = create((set) => ({ angle: 0, distance: 8, pixels: 80, follow: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ angle: 0, distance: 8, pixels: 80, follow: true }) }))

// The comparison stays visible on narrow canvases at the closest camera distance.
function useComparisonOffset () {
  const size = useThree((state) => state.size)
  const camera = useThree((state) => state.camera)
  const distance = useScreenStore((state) => state.distance)
  return Math.min(1.5, distance * Math.tan(camera.fov * Math.PI / 360) * size.width / Math.max(size.height, 1) / 2)
}

// The camera rotates around the scene or moves closer without changing world geometry.
function CameraRig () {
  const { angle, distance } = useScreenStore()
  useFrame(({ camera }) => { const radians = angle * Math.PI / 180; camera.position.set(Math.sin(radians) * distance, 0, Math.cos(radians) * distance); camera.lookAt(0, 0, 0); camera.updateMatrixWorld() }, -1)
  return null
}

// The direct calculation converts a desired pixel width into world units each frame.
function PixelSized () {
  const ref = useRef(null)
  const point = useRef(new Vector3())
  const pixels = useScreenStore((state) => state.pixels)
  const offset = useComparisonOffset()
  useFrame(({ camera, size }) => { if (!ref.current || !size.width || !size.height) return; ref.current.getWorldPosition(point.current); ref.current.scale.setScalar(calculateScaleFactor(point.current, pixels, camera, size)) })
  return <group position={[offset, 0, 0]}><group ref={ref}><mesh><planeGeometry /><meshBasicMaterial color='#6366f1' side={2} /></mesh></group></group>
}

// The scene compares normal world objects with the selected screen-space helper.
function ScreenScene () {
  const { name } = useParams()
  const { pixels, follow } = useScreenStore()
  const offset = useComparisonOffset()
  return <><color attach='background' args={['#eef2ff']} /><CameraRig /><directionalLight position={[3, 5, 6]} intensity={3} />{name === 'ScreenSpace'
    ? <><mesh><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color='#f59e0b' /></mesh><ScreenSpace depth={3}><mesh position={[0, 0.6, 0]}><planeGeometry args={[0.8, 0.3]} /><meshBasicMaterial color='#6366f1' depthTest={false} /></mesh></ScreenSpace></>
    : name === 'Billboard'
      ? <><mesh position={[-1.5, 0, 0]}><planeGeometry args={[1.6, 1.2]} /><meshBasicMaterial color='#f59e0b' side={2} /></mesh><Billboard position={[1.5, 0, 0]} follow={follow}><mesh><planeGeometry args={[1.6, 1.2]} /><meshBasicMaterial color='#6366f1' side={2} /></mesh></Billboard></>
      : <><mesh position={[-offset, 0, 0]}><planeGeometry /><meshBasicMaterial color='#f59e0b' side={2} /></mesh>{name === 'ScreenSizer' ? <group position={[offset, 0, 0]}><ScreenSizer scale={Math.sqrt(pixels)}><mesh><planeGeometry /><meshBasicMaterial color='#6366f1' side={2} /></mesh></ScreenSizer></group> : <PixelSized />}</>}</>
}

// The canvas resets controls when entering or leaving a screen-space lesson.
export default function ScreenDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useScreenStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('screenUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><ScreenScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t(name === 'ScreenSpace' ? 'screenUI.spaceLegend' : 'screenUI.legend')}</span></div>
}

// The panel moves the camera and adjusts the helper's target size or following behavior.
export function ScreenPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useScreenStore()
  const fields = name === 'Billboard' || name === 'ScreenSpace' ? [['angle', -70, 70, 1]] : [['distance', 4, 16, 0.5], ['pixels', 30, 150, 1]]
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('screenUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{fields.map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between gap-3'><span>{t(`screenUI.${key}`)}</span><span className='font-mono'>{state[key]}{key === 'angle' ? '°' : key === 'distance' ? ' m' : ' px'}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}{name === 'Billboard' && <Button aria-pressed={state.follow} onClick={() => state.setValue('follow', !state.follow)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.follow ? 'screenUI.followOn' : 'screenUI.followOff')}</Button>}<p className='text-xs leading-6 text-slate-500'>{t(name === 'ScreenSpace' ? 'screenUI.spaceHint' : name === 'Billboard' ? 'screenUI.billboardHint' : 'screenUI.sizeHint')}</p></section>
}
