import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The local mono tone makes changes in spatial direction and distance audible.
const audioUrl = `${import.meta.env.BASE_URL}media/spatial-tone.wav`

// The store shares the sound object, playback state and source position with the panel.
export const useSpatialAudioStore = create((set, get) => ({ x: 0, z: 0, sound: null, playing: false, error: false, pannerPosition: null, levels: [0, 0], setValue: (key, value) => set({ [key]: value }), setSound: (sound) => set({ sound, playing: false, error: false, pannerPosition: null, levels: [0, 0] }), reportPosition: (pannerPosition) => set((state) => state.pannerPosition?.join(',') === pannerPosition.join(',') ? state : { pannerPosition }), reportLevels: (levels) => set((state) => state.levels.join(',') === levels.join(',') ? state : { levels }), play: async () => { const sound = get().sound; if (!sound) return; try { await sound.context.resume(); if (get().sound !== sound) return; sound.setVolume(0.5); if (!sound.isPlaying) sound.play(); set({ playing: true, error: false }) } catch { set({ playing: false, error: true }) } }, pause: () => { const sound = get().sound; if (sound?.isPlaying) sound.pause(); set({ playing: false }) }, reset: () => set({ x: 0, z: 0 }) }))

// The source registers its loaded sound and follows the visible speaker marker.
function SoundSource () {
  const ref = useRef()
  const last = useRef(0)
  const meters = useRef(null)
  const { x, z, setSound, reportPosition, reportLevels } = useSpatialAudioStore()
  useEffect(() => { const sound = ref.current; setSound(sound); return () => setSound(null) }, [setSound])
  useEffect(() => {
    const sound = ref.current
    const context = sound.context
    const splitter = context.createChannelSplitter(2)
    const analysers = [context.createAnalyser(), context.createAnalyser()]
    const silent = context.createGain()
    silent.gain.value = 0
    sound.gain.connect(splitter)
    analysers.forEach((analyser, index) => { analyser.fftSize = 32768; splitter.connect(analyser, index); analyser.connect(silent) })
    silent.connect(context.destination)
    meters.current = analysers.map((analyser) => ({ analyser, data: new Float32Array(analyser.fftSize) }))
    return () => { meters.current = null; sound.gain.disconnect(splitter); splitter.disconnect(); analysers.forEach((analyser) => analyser.disconnect()); silent.disconnect() }
  }, [])
  useFrame((state) => {
    if (state.clock.elapsedTime - last.current < 0.25) return
    last.current = state.clock.elapsedTime
    const panner = ref.current?.panner
    if (panner?.positionX && panner?.positionY && panner?.positionZ) reportPosition([panner.positionX.value, panner.positionY.value, panner.positionZ.value].map((value) => value.toFixed(1)))
    if (meters.current) reportLevels(meters.current.map(({ analyser, data }) => { analyser.getFloatTimeDomainData(data); return Math.round(Math.sqrt(data.reduce((sum, value) => sum + value * value, 0) / data.length) * 1000) / 10 }))
  })
  return <group position={[x, 0, z]}><mesh><sphereGeometry args={[0.5, 32, 24]} /><meshStandardMaterial color='#6366f1' roughness={0.4} /></mesh><mesh position={[0, 0, 0.48]}><circleGeometry args={[0.21, 32]} /><meshBasicMaterial color='#fbbf24' /></mesh><PositionalAudio ref={ref} url={audioUrl} distance={3} loop /></group>
}

// The canvas renders a movable audio source and resets its position on entry.
export default function SpatialAudioDemo () {
  const { t } = useTranslation()
  const reset = useSpatialAudioStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('spatialAudioUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={4.5} minimumDistance={9} frontDepth={3} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, 4]} intensity={0.8} /><gridHelper args={[10, 10, '#c7d2fe', '#e0e7ff']} position={[0, -1, 0]} /><Suspense fallback={null}><SoundSource /></Suspense></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('spatialAudioUI.left')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('spatialAudioUI.listener')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('spatialAudioUI.right')}</span></div></div>
}

// The panel starts audio on demand and moves its source horizontally or in depth.
export function SpatialAudioPanel () {
  const { t } = useTranslation()
  const state = useSpatialAudioStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('spatialAudioUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><Button disabled={!state.sound} onClick={state.playing ? state.pause : state.play} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-wait disabled:opacity-50'>{t(!state.sound ? 'spatialAudioUI.loading' : state.playing ? 'spatialAudioUI.pause' : 'spatialAudioUI.play')}</Button><p role='status' className='text-xs leading-6 text-slate-500'>{t(state.error ? 'spatialAudioUI.error' : state.playing ? 'spatialAudioUI.playing' : 'spatialAudioUI.stopped')}</p>{[['x', -4, 4, 0.1], ['z', -4, 3, 0.1]].map(([key, min, max, step]) => <label key={key} className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t(`spatialAudioUI.${key}`)}</span><span className='font-mono'>{state[key]} m</span></span><input type='range' min={min} max={max} step={step} value={state[key]} onChange={(event) => state.setValue(key, Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>)}<p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('spatialAudioUI.panner')}: <span className='font-mono'>{state.pannerPosition?.join(', ') || '—'}</span> m</p><div className='space-y-2 text-xs text-slate-600'><p>{t('spatialAudioUI.levels')}</p>{state.levels.map((value, index) => <div key={index} className='flex items-center gap-2'><span className='w-5'>{t(index ? 'spatialAudioUI.right' : 'spatialAudioUI.left')}</span><meter min='0' max='20' value={value} aria-label={t(index ? 'spatialAudioUI.rightLevel' : 'spatialAudioUI.leftLevel')} className='h-3 min-w-0 flex-1' /><span className='w-10 text-right font-mono'>{value}%</span></div>)}<p className='leading-5 text-slate-500'>{t('spatialAudioUI.meterNote')}</p></div><p className='text-xs leading-6 text-slate-500'>{t('spatialAudioUI.headphones')}</p></section>
}
