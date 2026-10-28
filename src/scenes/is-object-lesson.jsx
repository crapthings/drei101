import { useEffect } from 'react'
import { IsObject } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

// The cases show the distinct inputs used by Drei's texture-loading helpers.
const examples = { object: { map: '/image.svg' }, array: ['/image.svg'], string: '/image.svg', nullValue: null, number: 42, date: new Date('2020-01-01T00:00:00Z'), functionValue: () => {} }

// The display strings preserve each input's JavaScript representation.
export const objectExampleCode = { object: "{ map: '/image.svg' }", array: "['/image.svg']", string: "'/image.svg'", nullValue: 'null', number: '42', date: "new Date('2020-01-01')", functionValue: '() => {}' }

// The store shares the selected input between the example and its control panel.
export const useIsObjectStore = create((set) => ({ selected: 'object', select: (selected) => set({ selected }), reset: () => set({ selected: 'object' }) }))

// The display evaluates the real exported predicate and presents its boolean result.
export default function IsObjectDemo () {
  const { t } = useTranslation()
  const { selected, reset } = useIsObjectStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  const result = IsObject(examples[selected])
  return <div role='group' aria-label={t('isObjectUI.scene')} className='flex min-h-80 flex-col items-center justify-center gap-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-8 text-center'><p className='text-xs font-medium text-indigo-500'>{t('isObjectUI.expression')}</p><code className='max-w-full break-all rounded-xl bg-white px-5 py-4 font-mono text-sm text-slate-800'>IsObject({objectExampleCode[selected]})</code><span className={`rounded-full px-5 py-2 font-mono text-lg font-semibold ${result ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>{String(result)}</span><p className='max-w-md text-sm leading-7 text-slate-600'>{t(result ? 'isObjectUI.true' : 'isObjectUI.false')}</p></div>
}

// The panel selects representative values for the predicate.
export function IsObjectPanel () {
  const { t } = useTranslation()
  const { selected, select, reset } = useIsObjectStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('isObjectUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><div className='grid grid-cols-2 gap-2'>{Object.keys(examples).map((key) => <Button key={key} aria-pressed={selected === key} onClick={() => select(key)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${selected === key ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(`isObjectUI.${key}`)}</Button>)}</div></section>
}
