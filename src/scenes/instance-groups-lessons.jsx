import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { createInstances, Merged } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// Two independent component pairs keep their instance contexts separate.
const [Boxes, BoxInstance] = createInstances()
const [Spheres, SphereInstance] = createInstances()

// The store controls the number of each object type and reports actual draw calls.
export const useInstanceGroupsStore = create((set) => ({ count: 12, calls: 0, setCount: (count) => set({ count }), reportCalls: (calls) => set((state) => state.calls === calls ? state : { calls }), reset: () => set({ count: 12, calls: 0 }) }))

// The positions form two rows, one for each geometry and material batch.
function itemPosition (index, row) {
  return [(index % 10 - 4.5) * 0.55, row + Math.floor(index / 10) * 0.55, 0]
}

// The createInstances path uses two independently created provider and child pairs.
function CreatedGroups () {
  const count = useInstanceGroupsStore((state) => state.count)
  return <><Boxes limit={20}><boxGeometry args={[0.35, 0.35, 0.35]} /><meshStandardMaterial color='#6366f1' />{Array.from({ length: count }, (_, index) => <BoxInstance key={index} position={itemPosition(index, -1.2)} />)}</Boxes><Spheres limit={20}><sphereGeometry args={[0.22, 20, 16]} /><meshStandardMaterial color='#f59e0b' />{Array.from({ length: count }, (_, index) => <SphereInstance key={index} position={itemPosition(index, 0.4)} />)}</Spheres></>
}

// The Merged path creates one reusable batch for each supplied source mesh.
function MergedGroups () {
  const count = useInstanceGroupsStore((state) => state.count)
  const meshes = useMemo(() => ({ box: new Mesh(new BoxGeometry(0.35, 0.35, 0.35), new MeshStandardMaterial({ color: '#6366f1' })), sphere: new Mesh(new SphereGeometry(0.22, 20, 16), new MeshStandardMaterial({ color: '#f59e0b' })) }), [])
  useEffect(() => () => { Object.values(meshes).forEach((mesh) => { mesh.geometry.dispose(); mesh.material.dispose() }) }, [meshes])
  return <Merged meshes={meshes} limit={20}>{({ box: Box, sphere: Sphere }) => <>{Array.from({ length: count }, (_, index) => <Box key={`b${index}`} position={itemPosition(index, -1.2)} />)}{Array.from({ length: count }, (_, index) => <Sphere key={`s${index}`} position={itemPosition(index, 0.4)} />)}</>}</Merged>
}

// The reporter displays actual draw calls from a completed frame.
function DrawCallReporter () {
  const last = useRef(0)
  const reportCalls = useInstanceGroupsStore((state) => state.reportCalls)
  useFrame(({ gl, clock }) => { if (clock.elapsedTime - last.current > 0.5) { last.current = clock.elapsedTime; reportCalls(gl.info.render.calls) } }, -1)
  return null
}

// The canvas selects the requested grouping API and displays two mesh types.
export default function InstanceGroupsDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useInstanceGroupsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('instanceGroupsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3} minimumDistance={8} frontDepth={0} /><directionalLight position={[3, 5, 5]} intensity={3} /><DrawCallReporter />{name === 'Merged' ? <MergedGroups /> : <CreatedGroups />}</Canvas></div>
}

// The panel changes each batch's size and reports the shared renderer's draw calls.
export function InstanceGroupsPanel () {
  const { t } = useTranslation()
  const { count, calls, setCount, reset } = useInstanceGroupsStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('instanceGroupsUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('instanceGroupsUI.count')}</span><span className='font-mono'>{count} × 2</span></span><input type='range' min='2' max='20' step='2' value={count} onChange={(event) => setCount(Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('instanceGroupsUI.calls')}: <span className='font-mono'>{calls}</span></p></section>
}
