import { useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Select, useSelect } from '@react-three/drei'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { Button, Radio, RadioGroup } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The panel tracks names reported by the actual selected Three.js objects.
export const useSelectionLessonStore = create((set) => ({
  selected: [],
  mode: 'click',
  setMode: (mode) => set((state) => ({ mode, selected: [], revision: state.revision + 1 })),
  revision: 0,
  setSelected: (selected) => set({ selected }),
  reset: () => set((state) => ({ selected: [], mode: 'click', revision: state.revision + 1 }))
}))

// Each object reads the selection context and highlights its own mesh.
export function SelectableCube ({ name, position }) {
  const ref = useRef(null)
  const selection = useSelect()
  const selected = selection.includes(ref.current)
  const label = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.beginPath()
    context.arc(64, 64, 58, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = '#4338ca'
    context.font = 'bold 72px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(name, 64, 66)
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [name])
  useEffect(() => () => label.dispose(), [label])
  return <mesh ref={ref} name={name} position={position}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={selected ? '#fbbf24' : '#6366f1'} /><sprite position={[0, 0.8, 0]} scale={[0.32, 0.32, 0.32]} raycast={() => null}><spriteMaterial map={label} transparent depthTest={false} /></sprite></mesh>
}

// Click selection supports toggling and Shift-based multiple selection.
function SelectionScene () {
  const revision = useSelectionLessonStore((state) => state.revision)
  const setSelected = useSelectionLessonStore((state) => state.setSelected)
  return <><ResponsiveFraming halfWidth={2.75} minimumDistance={8} frontDepth={0.5} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><Select key={revision} multiple onChangePointerUp={(items) => setSelected(items.map((item) => item.name).sort())}>{['A', 'B', 'C'].map((name, index) => <SelectableCube key={name} name={name} position={[(index - 1) * 2, 0, 0]} />)}</Select></>
}

// A fresh scene and selection state are created when entering or leaving a lesson.
export default function SelectionDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useSelectionLessonStore((state) => state.reset)
  const mode = useSelectionLessonStore((state) => state.mode)
  const revision = useSelectionLessonStore((state) => state.revision)
  const frame = useRef(null)
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return
      if (event.data?.type === 'drei-box-selection' && Array.isArray(event.data.names)) useSelectionLessonStore.getState().setSelected(event.data.names.filter((name) => ['A', 'B', 'C'].includes(name)))
      if (event.data?.type === 'drei-box-cancel') useSelectionLessonStore.getState().setSelected([])
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('selectionUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'>{mode === 'box' ? <iframe ref={frame} key={revision} title={t('selectionUI.boxFrame')} src={`${window.location.pathname}${window.location.search}#/selection-box`} className='size-full border-0' /> : <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><SelectionScene /></Canvas>}<span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('selectionUI.scale')}</span></div>
}

// The panel reports the selected object names and provides a complete reset.
export function SelectionPanel () {
  const { t } = useTranslation()
  const state = useSelectionLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('selectionUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><RadioGroup value={state.mode} onChange={state.setMode} aria-label={t('selectionUI.mode')} className='grid grid-cols-2 gap-2'>{['click', 'box'].map((mode) => <Radio key={mode} value={mode} className='cursor-pointer rounded-lg bg-slate-100 px-2 py-2 text-center text-xs text-slate-600 data-checked:bg-indigo-600 data-checked:text-white focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(`selectionUI.${mode}`)}</Radio>)}</RadioGroup><div role='status' className='rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-indigo-900'>{t('selectionUI.selected')} <span className='font-mono'>{state.selected.join(' / ') || '—'}</span></div><p className='text-xs leading-6 text-slate-500'>{t(state.mode === 'box' ? 'selectionUI.boxHint' : 'selectionUI.hint')}</p></section>
}
