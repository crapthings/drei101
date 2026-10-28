import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The capture page owns media resources in a separate document lifetime.
export default function MediaCaptureDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const screen = name === 'ScreenVideoTexture'
  return <div className='flex min-h-80 flex-col items-center justify-center gap-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-8 text-center'><p className='text-sm leading-7 text-slate-600'>{t('captureUI.openHint')}</p><a href={`${import.meta.env.BASE_URL}index.html?frame=media#/capture-${screen ? 'screen' : 'camera'}`} target='_blank' rel='noreferrer' className='rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t('captureUI.openDemo')} ↗</a></div>
}

// The panel describes the permission request and how to stop capture.
export function MediaCapturePanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  return <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('captureUI.panel')}</h3><p className='text-xs leading-6 text-slate-600'>{t(name === 'ScreenVideoTexture' ? 'captureUI.screenHint' : 'captureUI.cameraHint')}</p><p className='text-xs leading-6 text-slate-500'>{t('captureUI.privacy')}</p></section>
}
