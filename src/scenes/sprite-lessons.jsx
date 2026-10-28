import { useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { SpriteAnimator, useSpriteAnimator, useSpriteLoader, checkIfFrameIsEmpty, getFirstFrame } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store shares playback, manual position and frame-inspection settings.
export const useSpriteLessonStore = create((set) => ({ playing: true, fps: 4, offset: 0, opaque: false, grouped: false, frame: 0, frameInfo: '', setValue: (key, value) => set({ [key]: value }), setFrame: (frame) => set((state) => state.frame === frame ? state : { frame }), reset: () => set({ playing: true, fps: 4, offset: 0, opaque: false, grouped: false, frame: 0, frameInfo: '' }) }))

// The child accesses the animator context and drives manual progress from the panel.
function ManualFrame () {
  const animator = useSpriteAnimator()
  const offset = useSpriteLessonStore((state) => state.offset)
  useFrame(() => { if (animator) animator.current = offset })
  return null
}

// The scene loads a local sprite sheet and demonstrates playback or frame utilities.
function SpriteScene () {
  const { name } = useParams()
  const playing = useSpriteLessonStore((state) => state.playing)
  const fps = useSpriteLessonStore((state) => state.fps)
  const grouped = useSpriteLessonStore((state) => state.grouped)
  const setFrame = useSpriteLessonStore((state) => state.setFrame)
  const { spriteObj } = useSpriteLoader(`${import.meta.env.BASE_URL}images/sprite-demo.svg`, null, null, 4)
  useEffect(() => {
    if (!spriteObj?.spriteData?.frames || !Array.isArray(spriteObj.spriteData.frames)) return
    const frames = spriteObj.spriteData.frames
    const first = getFirstFrame(grouped ? { motion: frames } : frames, grouped ? 'motion' : undefined)
    useSpriteLessonStore.setState({ frameInfo: `${first.frame.x}, ${first.frame.y} · ${first.frame.w} × ${first.frame.h}` })
  }, [spriteObj, grouped])
  return <><color attach='background' args={['#eef2ff']} />{spriteObj && <group scale={3}><SpriteAnimator spriteDataset={spriteObj} numberOfFrames={4} fps={fps} loop autoPlay pause={!playing} roundFramePosition onFrame={({ currentFrame }) => setFrame(currentFrame)}>{name === 'useSpriteAnimator' && <ManualFrame />}</SpriteAnimator></group>}</>
}

// The canvas resets playback and inspection when switching sprite lessons.
export default function SpriteDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useSpriteLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('spriteUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><SpriteScene /></Canvas><span className='pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-700'>{t('spriteUI.sheet')}</span></div>
}

// The panel adjusts playback or inspects the exported frame helper functions.
export function SpritePanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useSpriteLessonStore()
  const sample = new Uint8ClampedArray([255, 255, 255, state.opaque ? 255 : 0])
  const empty = checkIfFrameIsEmpty(sample)
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('spriteUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{name === 'checkIfFrameIsEmpty' ? <><Button aria-pressed={state.opaque} onClick={() => state.setValue('opaque', !state.opaque)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t(state.opaque ? 'spriteUI.opaque' : 'spriteUI.transparent')}</Button><p className='rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-900'>alpha: {sample[3]} · empty: {String(empty)}</p></> : name === 'getFirstFrame' ? <><Button aria-pressed={state.grouped} onClick={() => state.setValue('grouped', !state.grouped)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t(state.grouped ? 'spriteUI.grouped' : 'spriteUI.array')}</Button><p className='rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-900'>{t('spriteUI.first')}: {state.frameInfo || '…'}</p></> : <><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(name === 'useSpriteAnimator' ? 'spriteUI.offset' : 'spriteUI.fps')}</span><span className='font-mono'>{name === 'useSpriteAnimator' ? state.offset.toFixed(2) : state.fps}</span></span><input type='range' min={name === 'useSpriteAnimator' ? 0 : 1} max={name === 'useSpriteAnimator' ? 1 : 12} step={name === 'useSpriteAnimator' ? 0.01 : 1} value={name === 'useSpriteAnimator' ? state.offset : state.fps} onChange={(event) => state.setValue(name === 'useSpriteAnimator' ? 'offset' : 'fps', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><Button aria-pressed={state.playing} onClick={() => state.setValue('playing', !state.playing)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t(state.playing ? 'spriteUI.playing' : 'spriteUI.paused')}</Button><p className='rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-900'>{t('spriteUI.frame')}: {state.frame}</p></>}<p className='text-xs leading-6 text-slate-500'>{t('spriteUI.hint')}</p></section>
}
