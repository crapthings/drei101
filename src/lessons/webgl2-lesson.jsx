import { useEffect, useState } from 'react'
import { isWebGL2Available } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { LessonLayout } from '@/lessons/lesson-layout'

// The demonstration checks the current browser using Drei's exported function.
function WebGL2Demo () {
  const { t } = useTranslation()
  const [result, setResult] = useState(null)
  useEffect(() => { setResult(isWebGL2Available()) }, [])
  return <div role='group' aria-label={t('webgl2UI.scene')} className='flex min-h-80 flex-col items-center justify-center gap-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-8 text-center'><code className='rounded-xl bg-white px-5 py-4 text-sm text-slate-800'>isWebGL2Available()</code><span role='status' className='rounded-full bg-indigo-600 px-5 py-2 font-mono text-lg font-semibold text-white'>{result === null ? '…' : String(result)}</span><Button onClick={() => setResult(isWebGL2Available())} className='cursor-pointer rounded-lg border border-indigo-200 bg-white px-4 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t('webgl2UI.check')}</Button><p className='max-w-md text-sm leading-7 text-slate-600'>{t('webgl2UI.hint')}</p></div>
}

// The panel identifies the browser environment used by the check.
function WebGL2Panel () {
  const { t } = useTranslation()
  return <section className='space-y-3 rounded-2xl border border-slate-200 bg-white p-5'><h3 className='text-xs font-medium'>{t('webgl2UI.panel')}</h3><p className='text-xs leading-6 text-slate-600'>{t('webgl2UI.description')}</p></section>
}

// The lesson describes what the capability check does and does not guarantee.
export default function WebGL2Lesson () {
  const code = "import { isWebGL2Available } from '@react-three/drei'\n\n// Check capability in the browser before choosing a rendering path.\nconst available = isWebGL2Available()\nconsole.log(available)"
  const source = 'https://github.com/pmndrs/drei/blob/master/src/core/Effects.tsx'
  return <LessonLayout lessonKey='webgl2Lesson' Demo={WebGL2Demo} Panel={WebGL2Panel} minimalCode={code} liveCode='isWebGL2Available()' docs={source} referenceUrl={source} />
}
