import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The store holds the next compilation options and the observed hidden-object state.
export const usePreloadStore = create((set) => ({ all: false, visible: false, revision: 0, observed: null, toggleAll: () => set((s) => ({ all: !s.all })), toggleVisible: () => set((s) => ({ visible: !s.visible })), run: () => set((s) => ({ revision: s.revision + 1, observed: null })), report: (observed) => set({ observed }), reset: () => set({ all: false, visible: false, revision: 0, observed: null }) }))

// The probe observes the actual renderer compilation triggered by the mounted Preload.
function PreloadProbe ({ hidden, all }) {
  const gl = useThree((state) => state.gl)
  const report = usePreloadStore((state) => state.report)
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => {
    const original = gl.compile
    const compile = function (...args) {
      const visible = hidden.current?.visible === true
      const result = original.apply(this, args)
      if (gl.compile === compile) gl.compile = original
      report(visible)
      return result
    }
    gl.compile = compile
    setReady(true)
    return () => { if (gl.compile === compile) gl.compile = original }
  }, [gl, hidden, report])
  return ready ? <Preload all={all} /> : null
}

// The scene contains one visible mesh and one mesh whose visibility can be changed.
function PreloadScene () {
  const hidden = useRef()
  const { all, visible, revision } = usePreloadStore()
  return <><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, 4]} intensity={0.8} /><mesh position={[-1.3, 0, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color='#6366f1' roughness={0.45} /></mesh><mesh ref={hidden} visible={visible} position={[1.3, 0, 0]}><torusKnotGeometry args={[0.65, 0.22, 100, 20]} /><meshStandardMaterial color='#f59e0b' metalness={0.5} roughness={0.25} /></mesh><PreloadProbe key={revision} hidden={hidden} all={all} /><OrbitControls makeDefault minDistance={4} maxDistance={12} /></>
}

// The canvas resets the experiment when the lesson is entered or left.
export default function PreloadDemo () {
  const { t } = useTranslation()
  const reset = usePreloadStore((state) => state.reset)
  useEffect(() => () => reset(), [reset])
  return <div role='group' aria-label={t('preloadUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 2, 7], fov: 45 }} dpr={[1, 2]}><PreloadScene /></Canvas></div>
}

// The panel changes visibility and explicitly reruns the preloading experiment.
export function PreloadPanel () {
  const { t } = useTranslation()
  const { all, visible, observed, toggleAll, toggleVisible, run } = usePreloadStore()
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('preloadUI.panel')}</h3><Button aria-pressed={all} onClick={toggleAll} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t(all ? 'preloadUI.allOn' : 'preloadUI.allOff')}</Button><Button aria-pressed={visible} onClick={toggleVisible} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t(visible ? 'preloadUI.hide' : 'preloadUI.show')}</Button><Button onClick={run} className='w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white focus-visible:outline-2'>{t('preloadUI.run')}</Button><div aria-live='polite' className='rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-800'>{t('preloadUI.observed')}: {observed === null ? '—' : t(observed ? 'preloadUI.visible' : 'preloadUI.hidden')}</div><p className='text-xs leading-6 text-slate-500'>{t('preloadUI.hint')}</p></section>
}
