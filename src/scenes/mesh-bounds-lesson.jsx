import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { meshBounds } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { Mesh, Raycaster, Vector3 } from 'three'

// The store shares the ray position, results and comparison timings.
export const useMeshBoundsStore = create((set) => ({ x: 0, y: 0, request: 0, exact: false, bounds: false, exactMs: null, boundsMs: null, exactHits: null, boundsHits: null, setValue: (key, value) => set({ [key]: value }), measure: () => set((state) => ({ request: state.request + 1 })), report: (value) => set(value), reset: () => set({ x: 0, y: 0, request: 0, exactMs: null, boundsMs: null, exactHits: null, boundsHits: null }) }))

// The scene casts a ray through the marker and compares exact and bounds-only intersection.
function BoundsScene () {
  const mesh = useRef()
  const { camera, scene } = useThree()
  const { x, y, request, report } = useMeshBoundsStore()
  useEffect(() => {
    const object = mesh.current
    object.geometry.computeBoundingBox()
    object.updateMatrixWorld(true)
    const ray = new Raycaster(new Vector3(x, y, 6), new Vector3(0, 0, -1))
    const exact = []
    const bounds = []
    Mesh.prototype.raycast.call(object, ray, exact)
    meshBounds.call(object, ray, bounds)
    report({ exact: exact.length > 0, bounds: bounds.length > 0 })
  }, [x, y, report])
  useEffect(() => {
    if (!request) return
    const object = mesh.current
    scene.updateMatrixWorld(true)
    const ray = new Raycaster()
    const direction = new Vector3(0, 0, -1)
    const results = {}
    for (const [key, method] of [['exact', Mesh.prototype.raycast], ['bounds', meshBounds]]) {
      let hits = 0
      const start = performance.now()
      for (let i = 0; i < 200; i++) {
        ray.set(new Vector3((i % 20 - 9.5) * 0.22, (Math.floor(i / 20) - 4.5) * 0.32, 6), direction)
        const intersections = []
        method.call(object, ray, intersections)
        if (intersections.length) hits++
      }
      results[`${key}Ms`] = performance.now() - start
      results[`${key}Hits`] = hits
    }
    report(results)
  }, [request, scene, camera, report])
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, 2, 4]} intensity={0.8} /><mesh ref={mesh} raycast={meshBounds}><torusGeometry args={[1.3, 0.45, 80, 160]} /><meshStandardMaterial color='#818cf8' /></mesh><mesh position={[x, y, 1]}><sphereGeometry args={[0.07, 16, 12]} /><meshBasicMaterial color='#f97316' depthTest={false} /></mesh></>
}

// The canvas uses a fixed front view so the marker indicates the test ray.
export default function MeshBoundsDemo () {
  const { t } = useTranslation()
  const reset = useMeshBoundsStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('meshBoundsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}><BoundsScene /></Canvas></div>
}

// The panel moves the ray and compares exact and bounding-volume hits.
export function MeshBoundsPanel () {
  const { t } = useTranslation()
  const state = useMeshBoundsStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('meshBoundsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div>{['x', 'y'].map((key) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`meshBoundsUI.${key}`)}</span><span>{state[key]} m</span></span><input type='range' min='-2' max='2' step='0.1' value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600' /></label>)}<div role='status' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'><p>{t('meshBoundsUI.exact')}: {t(state.exact ? 'meshBoundsUI.hit' : 'meshBoundsUI.miss')}</p><p>{t('meshBoundsUI.bounds')}: {t(state.bounds ? 'meshBoundsUI.hit' : 'meshBoundsUI.miss')}</p></div><Button onClick={state.measure} className='w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white'>{t('meshBoundsUI.measure')}</Button><p className='text-xs leading-6 text-slate-500'>{t('meshBoundsUI.exact')}: {state.exactMs == null ? '—' : `${state.exactMs.toFixed(2)} ms · ${state.exactHits}/200`}<br />{t('meshBoundsUI.bounds')}: {state.boundsMs == null ? '—' : `${state.boundsMs.toFixed(2)} ms · ${state.boundsHits}/200`}</p></section>
}
