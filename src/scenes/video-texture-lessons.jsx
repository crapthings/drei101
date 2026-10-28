import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { VideoTexture, useVideoTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The video is a local, silent animation used to demonstrate texture updates.
const videoUrl = `${import.meta.env.BASE_URL}media/motion-demo.mp4`

// The store exposes the current video element and playback status to the panel.
export const useVideoLessonStore = create((set, get) => ({ video: null, playing: false, error: false, time: 0, setTime: (time) => set({ time }), setVideo: (video) => set({ video, playing: false, error: false, time: video?.currentTime || 0 }), play: async () => { const video = get().video; if (!video) return; try { await video.play(); set({ playing: true, error: false }) } catch { set({ playing: false, error: true }) } }, pause: () => { get().video?.pause(); set({ playing: false }) } }))

// The surface attaches the video texture and registers its element for user-triggered playback.
function VideoSurface ({ texture }) {
  const setVideo = useVideoLessonStore((state) => state.setVideo)
  const setTime = useVideoLessonStore((state) => state.setTime)
  useEffect(() => {
    const video = texture.image
    const update = () => setTime(video.currentTime)
    let frame
    const updateFrame = () => { texture.needsUpdate = true; frame = video.requestVideoFrameCallback(updateFrame) }
    setVideo(video)
    video.addEventListener('timeupdate', update)
    // Drei caches the texture while its component can dispose it on unmount; re-register frame updates on reuse.
    if (video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(updateFrame)
    return () => { video.pause(); video.removeEventListener('timeupdate', update); if (frame !== undefined) video.cancelVideoFrameCallback(frame); setVideo(null) }
  }, [texture, setVideo, setTime])
  return <mesh><planeGeometry args={[4.8, 2.7]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
}

// The hook obtains a video texture without starting playback automatically.
function HookVideo () {
  const texture = useVideoTexture(videoUrl, { start: false, muted: true, loop: true })
  return <VideoSurface texture={texture} />
}

// The component obtains the same texture through its render function.
function ComponentVideo () {
  return <VideoTexture src={videoUrl} start={false} muted loop>{(texture) => <VideoSurface texture={texture} />}</VideoTexture>
}

// The canvas presents the selected video texture loader on a flat screen.
export default function VideoTextureDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  return <div role='group' aria-label={t('videoLessonUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.8} minimumDistance={6} /><Suspense fallback={null}>{name === 'VideoTexture' ? <ComponentVideo /> : <HookVideo />}</Suspense></Canvas></div>
}

// The panel starts or pauses the muted video in response to a user action.
export function VideoTexturePanel () {
  const { t } = useTranslation()
  const { video, playing, error, time, play, pause } = useVideoLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('videoLessonUI.panel')}</h3><Button disabled={!video} onClick={playing ? pause : play} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-wait disabled:opacity-50'>{t(!video ? 'videoLessonUI.loading' : playing ? 'videoLessonUI.pause' : 'videoLessonUI.play')}</Button><p role='status' className='text-xs leading-6 text-slate-500'>{t(error ? 'videoLessonUI.error' : playing ? 'videoLessonUI.playing' : 'videoLessonUI.stopped')}</p><p className='text-xs text-slate-600'>{t('videoLessonUI.time')}: <span className='font-mono'>{time.toFixed(1)} s</span></p><p className='break-all rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-700'>/media/motion-demo.mp4</p></section>
}
