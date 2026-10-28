import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Bvh, OrbitControls, useBVH } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Raycaster, Vector2 } from 'three'

// The store controls acceleration and retains separate measurements for comparison.
export const useBvhStore = create((set) => ({ enabled: false, request: 0, ready: false, normalHits: null, bvhHits: null, normalMs: null, bvhMs: null, setEnabled: (enabled) => set({ enabled, ready: false }), benchmark: () => set((state) => ({ request: state.request + 1 })), setReady: (ready) => set({ ready }), record: (enabled, ms, hits) => set({ [enabled ? 'bvhMs' : 'normalMs']: ms, [enabled ? 'bvhHits' : 'normalHits']: hits }), reset: () => set({ enabled: false, request: 0, normalHits: null, bvhHits: null, normalMs: null, bvhMs: null }) }))

// The hook attaches the deprecated BVH API to one mesh when acceleration is enabled.
function HookAcceleration ({ mesh }) {
  useBVH(mesh)
  return null
}

// The probe performs the same grid of raycasts and times the actual intersections.
function RaycastProbe ({ mesh, enabled }) {
  const { camera, scene } = useThree()
  const request = useBvhStore((state) => state.request)
  const record = useBvhStore((state) => state.record)
  const setReady = useBvhStore((state) => state.setReady)
  useEffect(() => { setReady(true); return () => setReady(false) }, [setReady])
  useEffect(() => {
    if (!request || !mesh.current) return
    scene.updateMatrixWorld(true)
    camera.updateMatrixWorld(true)
    const raycaster = new Raycaster()
    const point = new Vector2()
    let hits = 0
    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      point.set((i % 10 - 4.5) / 6.5, (Math.floor(i / 10) - 4.5) / 6.5)
      raycaster.setFromCamera(point, camera)
      if (raycaster.intersectObject(mesh.current, false).length) hits++
    }
    record(enabled, performance.now() - start, hits)
  }, [request, mesh, enabled, camera, scene, record])
  return null
}

// The scene applies the selected API to a high-resolution sphere.
function BvhScene () {
  const { name } = useParams()
  const mesh = useRef()
  const enabled = useBvhStore((state) => state.enabled)
  const object = <mesh ref={mesh}><sphereGeometry args={[1.6, 256, 128]} /><meshStandardMaterial color='#818cf8' roughness={0.55} /></mesh>
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, 2, -4]} intensity={0.8} />{name === 'Bvh' && enabled ? <Bvh key='accelerated'>{object}</Bvh> : object}{name === 'useBVH' && enabled && <HookAcceleration mesh={mesh} />}<RaycastProbe key={`${name}-${enabled}`} mesh={mesh} enabled={enabled} /><OrbitControls makeDefault minDistance={4} maxDistance={12} /></>
}

// The canvas remounts the scene on mode changes so each BVH is built or disposed cleanly.
export default function BvhDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { enabled, reset } = useBvhStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('bvhUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}><BvhScene key={`${name}-${enabled}`} /></Canvas></div>
}

// The panel lets readers measure the same rays in native and accelerated modes.
export function BvhPanel () {
  const { t } = useTranslation()
  const { enabled, ready, normalHits, bvhHits, normalMs, bvhMs, setEnabled, benchmark, reset } = useBvhStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('bvhUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><Button aria-pressed={enabled} onClick={() => setEnabled(!enabled)} className='w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(enabled ? 'bvhUI.enabled' : 'bvhUI.disabled')}</Button><Button disabled={!ready} onClick={benchmark} className='w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white disabled:opacity-50'>{t('bvhUI.measure')}</Button><div role='status' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'><p>{t('bvhUI.normal')}: {normalMs == null ? '—' : `${normalMs.toFixed(2)} ms`}</p><p>{t('bvhUI.accelerated')}: {bvhMs == null ? '—' : `${bvhMs.toFixed(2)} ms`}</p><p>{t('bvhUI.hits')}: {normalHits ?? '—'} / {bvhHits ?? '—'}</p></div><p className='text-xs leading-6 text-slate-500'>{t('bvhUI.hint')}</p></section>
}
