import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { FaceLandmarker, FaceLandmarkerDefaults, useFaceLandmarker } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { clear } from 'suspend-react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The store holds a local image and the detector's most recent result.
export const useFaceLandmarkerStore = create((set) => ({ file: null, result: null, status: 'idle', begin: () => set({ file: null, result: null, status: 'loading' }), select: (file) => set({ file, result: null, status: file ? 'loading' : 'idle' }), report: (result) => set({ result, status: result.faceLandmarks.length ? 'detected' : 'empty' }), fail: () => set({ result: null, status: 'error' }), reset: () => set({ file: null, result: null, status: 'idle' }) }))

// The boundary exposes failures from the external detector resources.
class LandmarkerBoundary extends Component {
  constructor (props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError () { return { failed: true } }
  componentDidCatch () { this.props.onError() }
  componentDidUpdate (previous) { if (this.state.failed && previous.file !== this.props.file) this.setState({ failed: false }) }
  render () { return this.state.failed ? null : this.props.children }
}

// The detector reads its instance from context and runs once on the selected image.
function DetectImage ({ url }) {
  const detector = useFaceLandmarker()
  const report = useFaceLandmarkerStore((state) => state.report)
  const fail = useFaceLandmarkerStore((state) => state.fail)
  useEffect(() => {
    let cancelled = false
    const image = new Image()
    image.onload = () => {
      if (cancelled) return
      try { report(detector.detect(image)) } catch { fail() }
    }
    image.onerror = () => { if (!cancelled) fail() }
    image.src = url
    return () => { cancelled = true; image.src = '' }
  }, [detector, url, report, fail])
  return null
}

// The image preview overlays the detector's normalized landmark coordinates.
function ImagePreview ({ url }) {
  const result = useFaceLandmarkerStore((state) => state.result)
  return <div className='relative inline-block max-w-full overflow-hidden rounded-xl bg-slate-100'><img src={url} alt='' className='block max-h-[55vh] max-w-full object-contain' /><svg aria-hidden='true' viewBox='0 0 1 1' preserveAspectRatio='none' className='pointer-events-none absolute inset-0 h-full w-full'>{result?.faceLandmarks.flatMap((face, faceIndex) => face.map((point, index) => <circle key={`${faceIndex}-${index}`} cx={point.x} cy={point.y} r='0.0025' fill='#4f46e5' />))}</svg></div>
}

// The demo loads the detector only after a user selects a local image.
export default function FaceLandmarkerDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { file, status, reset, fail } = useFaceLandmarkerStore()
  const [url, setUrl] = useState(null)
  const options = useMemo(() => ({ ...FaceLandmarkerDefaults.options, baseOptions: { ...FaceLandmarkerDefaults.options.baseOptions, delegate: 'CPU' }, runningMode: 'IMAGE' }), [])
  useEffect(() => {
    if (!file) { setUrl(null); return }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('faceLandmarkerUI.scene')} className='flex min-h-80 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6'>{url ? <><ImagePreview url={url} /><LandmarkerBoundary file={file} onError={() => { clear([FaceLandmarkerDefaults.basePath, JSON.stringify(options)]); fail() }}><Suspense fallback={null}><FaceLandmarker options={options}><DetectImage url={url} /></FaceLandmarker></Suspense></LandmarkerBoundary><p role={status === 'error' ? 'alert' : 'status'} className='text-xs text-slate-600'>{t(`faceLandmarkerUI.${status}`)}</p></> : <p role={status === 'error' ? 'alert' : undefined} className='text-sm text-slate-600'>{t(status === 'error' ? 'faceLandmarkerUI.error' : status === 'loading' ? 'faceLandmarkerUI.loading' : 'faceLandmarkerUI.chooseHint')}</p>}</div>
}

// The panel selects a local image and reports detected face and landmark counts.
export function FaceLandmarkerPanel () {
  const { t } = useTranslation()
  const { file, result, begin, select, reset } = useFaceLandmarkerStore()
  const request = useRef(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => () => request.current?.abort(), [])
  const cancelSample = () => { request.current?.abort(); request.current = null; setLoading(false) }
  const loadSample = async (url, name, type) => {
    cancelSample()
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    begin()
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error('Image unavailable')
      const blob = await response.blob()
      if (!controller.signal.aborted) select(new File([blob], name, { type }))
    } catch { if (!controller.signal.aborted) useFaceLandmarkerStore.getState().fail() } finally {
      if (!controller.signal.aborted) { request.current = null; setLoading(false) }
    }
  }
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('faceLandmarkerUI.panel')}</h3><label className='block space-y-2 text-xs text-slate-600'><span>{t('faceLandmarkerUI.choose')}</span><input type='file' accept='image/*' onChange={(event) => { cancelSample(); select(event.target.files?.[0] || null); event.target.value = '' }} className='block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-indigo-700 focus-visible:outline-2' /></label><Button onClick={() => loadSample(`${import.meta.env.BASE_URL}images/no-face-sample.png`, 'no-face-sample.png', 'image/png')} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t('faceLandmarkerUI.sample')}</Button><Button onClick={() => loadSample('https://storage.googleapis.com/mediapipe-assets/business-person.png', 'business-person.png', 'image/png')} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2'>{t('faceLandmarkerUI.faceSample')}</Button><Button disabled={!file && !loading} onClick={() => { cancelSample(); reset() }} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 disabled:opacity-50 focus-visible:outline-2'>{t('faceLandmarkerUI.clear')}</Button><div aria-live='polite' className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800'><p>{t('faceLandmarkerUI.faces')}: {result?.faceLandmarks.length ?? '—'}</p><p>{t('faceLandmarkerUI.points')}: {result?.faceLandmarks[0]?.length ?? '—'}</p></div><p className='text-xs leading-6 text-slate-500'>{t('faceLandmarkerUI.hint')}</p><a href='https://colab.research.google.com/github/googlesamples/mediapipe/blob/main/examples/face_landmarker/python/%5BMediaPipe_Python_Tasks%5D_Face_Landmarker.ipynb' target='_blank' rel='noreferrer' className='block text-xs text-indigo-600 hover:underline'>{t('faceLandmarkerUI.source')} ↗</a></section>
}
