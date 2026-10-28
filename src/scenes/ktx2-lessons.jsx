import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Ktx2, useKTX2 } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The sample uses BasisLZ ETC1S compression and the locally supplied transcoder.
const textureUrl = `${import.meta.env.BASE_URL}textures/ktx2/2d_etc1s.ktx2`

// The local path contains the Basis JavaScript and WebAssembly transcoder files.
const basisPath = `${import.meta.env.BASE_URL}basis/`

// The store controls the scale and rotation of the texture display.
export const useKtxLessonStore = create((set) => ({ rotation: 0, scale: 1, setValue: (key, value) => set({ [key]: value }), reset: () => set({ rotation: 0, scale: 1 }) }))

// The surface assigns the compressed texture directly to a basic material.
function TextureSurface ({ texture }) {
  const { rotation, scale } = useKtxLessonStore()
  // The source's KTX orientation is flipped on this plane without mutating the cached texture.
  return <mesh rotation-z={rotation} scale={[scale, -scale, scale]}><planeGeometry args={[3, 3]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
}

// The hook obtains the GPU texture after device-specific transcoding.
function HookTexture () {
  const texture = useKTX2(textureUrl, basisPath)
  return <TextureSurface texture={texture} />
}

// The component passes the transcoded texture through its render function.
function ComponentTexture () {
  return <Ktx2 input={textureUrl} basisPath={basisPath}>{(texture) => <TextureSurface texture={texture} />}</Ktx2>
}

// The canvas selects the requested loader and resets the display transform.
export default function KtxDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useKtxLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('ktxUI.scene', { name })} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.8} minimumDistance={7} /><Suspense fallback={null}>{name === 'Ktx2' ? <ComponentTexture /> : <HookTexture />}</Suspense></Canvas></div>
}

// The panel changes the displayed texture's rotation and scale.
export function KtxPanel () {
  const { t } = useTranslation()
  const state = useKtxLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('ktxUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{[['rotation', -3, 3, 0.1], ['scale', 0.5, 1.5, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`ktxUI.${key}`)}</span><span className='font-mono'>{state[key]}</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='break-all rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-700'>ETC1S · BasisLZ · 40 × 40</p><p className='text-xs leading-6 text-slate-500'>{t('ktxUI.credit')} <a className='text-indigo-600 underline' href='https://github.com/donmccurdy/KTX2-Samples' target='_blank' rel='noreferrer'>Don McCurdy</a> · <a className='text-indigo-600 underline' href='https://creativecommons.org/licenses/by-sa/4.0/' target='_blank' rel='noreferrer'>CC BY-SA 4.0</a></p></section>
}
