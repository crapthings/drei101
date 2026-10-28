import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { GizmoHelper, GizmoViewcube, GizmoViewport, OrbitControls, useGizmoContext } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Vector3 } from 'three'

// The store selects the helper style and tracks custom context interactions.
export const useGizmoStore = create((set) => ({ cube: false, clicks: 0, revision: 0, toggle: () => set((state) => ({ cube: !state.cube })), clicked: () => set((state) => ({ clicks: state.clicks + 1 })), reset: () => set((state) => ({ cube: false, clicks: 0, revision: state.revision + 1 })) }))

// The custom gizmo uses context to animate the main camera toward the positive Z axis.
function ContextControl () {
  const { tweenCamera } = useGizmoContext()
  const clicked = useGizmoStore((state) => state.clicked)
  return <mesh onClick={(event) => { event.stopPropagation(); tweenCamera(new Vector3(0, 0, 1)); clicked() }}><boxGeometry args={[55, 55, 55]} /><meshBasicMaterial color='#f97316' /></mesh>
}

// The scene places an orientation widget over an asymmetric reference object.
export default function GizmoDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { cube, revision, reset } = useGizmoStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('gizmoUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas key={revision} camera={{ position: [5, 4, 6], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, -3]} intensity={1} /><mesh><boxGeometry args={[2, 1.2, 1]} /><meshStandardMaterial color='#818cf8' /></mesh><mesh position={[1.25, 0.8, 0]}><sphereGeometry args={[0.4, 24, 16]} /><meshStandardMaterial color='#f97316' /></mesh><gridHelper args={[7, 7, '#a5b4fc', '#c7d2fe']} position={[0, -1, 0]} /><OrbitControls makeDefault /><GizmoHelper alignment='bottom-right' margin={[85, 85]}>{name === 'useGizmoContext' ? <ContextControl /> : name === 'GizmoViewcube' || (name === 'GizmoHelper' && cube) ? <GizmoViewcube /> : <GizmoViewport axisColors={['#ef4444', '#22c55e', '#6366f1']} labelColor='white' />}</GizmoHelper></Canvas></div>
}

// The panel exposes a style switch or reports custom context interactions.
export function GizmoPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { cube, clicks, toggle, reset } = useGizmoStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('gizmoUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div>{name === 'GizmoHelper' && <Button onClick={toggle} className='w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(cube ? 'gizmoUI.cube' : 'gizmoUI.axes')}</Button>}{name === 'useGizmoContext' && <p role='status' className='text-xs text-slate-600'>{t('gizmoUI.clicks', { count: clicks })}</p>}<p className='text-xs leading-6 text-slate-500'>{t(name === 'useGizmoContext' ? 'gizmoUI.customHint' : 'gizmoUI.hint')}</p></section>
}
