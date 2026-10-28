import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import FaceLandmarkerFrame from '@/scenes/face-landmarker-frame'

// The dedicated React root gives the detector its own lifecycle without StrictMode remounts.
export default function FaceLandmarkerEmbed () {
  const host = useRef(null)
  const { t } = useTranslation()
  useEffect(() => {
    const element = document.createElement('div')
    host.current.appendChild(element)
    const root = createRoot(element)
    root.render(<FaceLandmarkerFrame />)
    return () => { queueMicrotask(() => { root.unmount(); element.remove() }) }
  }, [])
  return <div ref={host} role='group' aria-label={t('faceLandmarkerUI.scene')} className='max-h-[70vh] min-h-[540px] overflow-auto rounded-2xl border border-indigo-100 bg-indigo-50' />
}

// The panel summarizes the local processing and external model dependency.
export function FaceLandmarkerEmbedPanel () {
  const { t } = useTranslation()
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('faceLandmarkerUI.panel')}</h3><p className='text-xs leading-6 text-slate-600'>{t('faceLandmarkerUI.hint')}</p></section>
}
