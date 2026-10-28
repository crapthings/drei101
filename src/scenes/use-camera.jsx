import { useEffect, useLayoutEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCamera } from '@react-three/drei'
import { CanvasTexture, Mesh, OrthographicCamera } from 'three'
import { Button, Field, Label, Switch } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

// Picking mode and actual hit results make the non-default-camera mismatch directly observable.
export const usePickingStore = create((set) => ({
  correct: true, selected: null, clicks: 0,
  setCorrect: (correct) => set({ correct, selected: null, clicks: 0 }),
  hit: (selected) => set((state) => ({ selected, clicks: state.clicks + 1 })),
  reset: () => set({ correct: true, selected: null, clicks: 0 })
}))

// Local label textures keep scene labels aligned to the rendered camera without external fonts or DOM projection.
function PickTarget ({ letter, x, camera }) {
  const raycast = useCamera(camera)
  const correct = usePickingStore((state) => state.correct)
  const selected = usePickingStore((state) => state.selected)
  const hit = usePickingStore((state) => state.hit)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 256, 256)
    context.fillStyle = '#312e81'
    context.font = 'bold 130px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(letter, 128, 138)
    return new CanvasTexture(canvas)
  }, [letter])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={[x, 0, 0]} raycast={correct ? raycast : Mesh.prototype.raycast} onClick={(event) => { event.stopPropagation(); hit(letter) }}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={texture} color={selected === letter ? '#a5b4fc' : '#e0e7ff'} /></mesh>
}

// Rendering uses an offset camera while R3F retains its default camera, intentionally exposing wrong-camera picking.
function PickingScene () {
  const size = useThree((state) => state.size)
  const camera = useMemo(() => new OrthographicCamera(-4, 4, 3, -3, 0.1, 40), [])
  useLayoutEffect(() => {
    camera.left = -4
    camera.right = 4
    camera.top = 4 * size.height / size.width
    camera.bottom = -camera.top
    camera.position.set(1.5, 0, 8)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
  }, [camera, size])
  useFrame(({ gl, scene, camera: defaultCamera }) => {
    defaultCamera.updateMatrixWorld()
    gl.render(scene, camera)
  }, 1)
  return <><color attach='background' args={['#eef2ff']} />{['A', 'B', 'C'].map((letter, index) => <PickTarget key={letter} letter={letter} x={(index - 1) * 1.5} camera={camera} />)}</>
}

// The switch changes only raycasting, so visible objects cannot move to conceal an incorrect hit.
export function PickingPanel () {
  const { t } = useTranslation()
  const state = usePickingStore()
  return (
    <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'><h3 className='text-sm'>{t('pickingUI.title')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>
      <Field className='flex items-center justify-between gap-3'><Label className='text-xs'>{t('pickingUI.correct')}</Label><Switch checked={state.correct} onChange={state.setCorrect} className='group inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-slate-200 data-checked:bg-indigo-600 focus-visible:outline-2'><span className='size-3.5 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-[18px]' /></Switch></Field>
      <p className='text-xs leading-6 text-slate-600'>{t(state.correct ? 'pickingUI.correctHint' : 'pickingUI.wrongHint')}</p>
      <div role='status' className='rounded-lg bg-indigo-50 p-4 text-xs leading-7 text-indigo-900'><p>{t('pickingUI.selected')} <strong className='font-mono text-lg'>{state.selected === 'miss' ? t('pickingUI.miss') : state.selected || '—'}</strong></p><p>{t('pickingUI.clicks')} {state.clicks}</p></div>
      <dl className='space-y-3 text-xs text-slate-600'><div><dt className='mb-1 text-indigo-500'>{t('pickingUI.renderCamera')}</dt><dd className='font-mono'>Orthographic · [1.5, 0, 8]</dd></div><div><dt className='mb-1 text-indigo-500'>{t('pickingUI.defaultCamera')}</dt><dd className='font-mono'>Perspective · [0, 0, 8]</dd></div></dl>
      <p className='text-xs leading-6 text-slate-500'>{t('pickingUI.hint')}</p>
    </section>
  )
}

// The centered C target gives a repeatable click whose expected result is independent of viewport size.
export default function PickingDemo () {
  const { t } = useTranslation()
  return <div role='group' aria-label={t('pickingUI.label')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 40 }} dpr={[1, 2]} onPointerMissed={() => usePickingStore.getState().hit('miss')}><PickingScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('pickingUI.overlay')}</span><div className='pointer-events-none absolute inset-0 flex items-center justify-center'><span className='size-14 rounded-full border border-dashed border-indigo-500/60' /></div></div>
}
