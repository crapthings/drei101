import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAnimations } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { AnimationClip, NumberKeyframeTrack } from 'three'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The clips animate the same object with two independently selectable motions.
const clips = [new AnimationClip('Bounce', 2, [new NumberKeyframeTrack('.position[y]', [0, 1, 2], [0, 1, 0])]), new AnimationClip('Turn', 2, [new NumberKeyframeTrack('.rotation[y]', [0, 1, 2], [0, Math.PI, Math.PI * 2])])]

// The store shares the selected clip and playback settings between the panel and scene.
export const useAnimationStore = create((set) => ({ clip: 'Bounce', playing: true, speed: 1, setValue: (key, value) => set({ [key]: value }), reset: () => set({ clip: 'Bounce', playing: true, speed: 1 }) }))

// The model binds its clips to a group and fades between the selected actions.
function AnimatedModel () {
  const root = useRef(null)
  const { clip, playing, speed } = useAnimationStore()
  const { actions, mixer } = useAnimations(clips, root)
  useEffect(() => { const action = actions[clip]; action.reset().fadeIn(0.2).play(); return () => { action.fadeOut(0.2) } }, [actions, clip])
  useEffect(() => { mixer.timeScale = playing ? speed : 0 }, [mixer, playing, speed])
  return <group ref={root}><mesh><boxGeometry args={[1.4, 1.4, 1.4]} /><meshStandardMaterial color='#6366f1' /></mesh><mesh position={[0, 0.1, 0.72]}><boxGeometry args={[0.8, 0.45, 0.08]} /><meshStandardMaterial color='#fbbf24' /></mesh><mesh position={[0, 0.9, 0]}><sphereGeometry args={[0.22, 20, 20]} /><meshStandardMaterial color='#f59e0b' /></mesh></group>
}

// The demo presents an animated model with enough space for both clips.
export default function UseAnimationsDemo () {
  const { t } = useTranslation()
  const reset = useAnimationStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('useAnimationsUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 1, 8], fov: 50 }}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.8} minimumDistance={8} frontDepth={1} /><directionalLight position={[3, 5, 5]} intensity={3} /><directionalLight position={[-4, 2, 3]} intensity={0.8} /><AnimatedModel /></Canvas></div>
}

// The panel switches clips and controls the animation mixer.
export function UseAnimationsPanel () {
  const { t } = useTranslation()
  const state = useAnimationStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('useAnimationsUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div><div className='space-y-2'><p className='text-xs text-slate-600'>{t('useAnimationsUI.clip')}</p><div className='grid grid-cols-2 gap-2'>{['Bounce', 'Turn'].map((clip) => <Button key={clip} aria-pressed={state.clip === clip} onClick={() => state.setValue('clip', clip)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs ${state.clip === clip ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(`useAnimationsUI.${clip}`)}</Button>)}</div></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('useAnimationsUI.speed')}</span><span>{state.speed}×</span></span><input type='range' min='0.25' max='2' step='0.25' value={state.speed} onChange={(event) => state.setValue('speed', Number(event.target.value))} className='w-full accent-indigo-600' /></label><Button aria-pressed={state.playing} onClick={() => state.setValue('playing', !state.playing)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(state.playing ? 'useAnimationsUI.pause' : 'useAnimationsUI.play')}</Button></section>
}
