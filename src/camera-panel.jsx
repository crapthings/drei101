import { Button, Field, Input, Label } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { useDemoStore } from '@/store'

// Shared focus styling makes parameter controls visible during keyboard navigation.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500'

// Parameter fields update the same Zustand values consumed by the live camera.
export function CameraPanel () {
  const { t } = useTranslation()
  const state = useDemoStore()
  const fields = [{ name: 'fov', min: 15, max: 110, step: 1, unit: '°' }, { name: 'distance', min: 4, max: 18, step: 0.1, unit: 'm' }, { name: 'near', min: 0.1, max: 12, step: 0.1, unit: 'm' }, { name: 'far', min: 13, max: 60, step: 1, unit: 'm' }]

  return (
    <section className='rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40 p-5'>
      <div className='mb-7 flex items-center justify-between'><h2 className='text-sm font-medium'>{t('ui.parameters')}</h2><Button onClick={state.reset} className={`cursor-pointer text-xs text-indigo-600 ${focus}`}>{t('ui.reset')} ↺</Button></div>
      <div className='space-y-6'>
        {fields.map(({ name, min, max, step, unit }) => (
          <Field key={name}>
            <div className='mb-3 flex justify-between text-xs'><Label className='text-slate-600'>{t(`ui.${name}`)}</Label><output className='font-mono text-indigo-600'>{state[name]} {unit}</output></div>
            <Input type='range' min={min} max={max} step={step} value={state[name]} onChange={(event) => state.setParameter(name, Number(event.target.value))} className={`h-1 w-full cursor-pointer accent-indigo-600 ${focus}`} />
          </Field>
        ))}
      </div>
      <p className='mt-8 mb-3 text-xs text-slate-500'>{t('ui.presets')}</p>
      <div className='flex gap-2'>{[['wide', 90], ['normal', 50], ['tele', 25]].map(([label, fov]) => <Button key={label} onClick={() => state.setParameter('fov', fov)} aria-pressed={state.fov === fov} className={`flex-1 cursor-pointer rounded-lg border px-2 py-2 text-xs ${state.fov === fov ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'} ${focus}`}>{t(`ui.${label}`)}</Button>)}</div>
      <p className='mt-6 border-t border-slate-200 pt-5 text-xs leading-6 text-slate-500'>{t('ui.hint')}</p>
    </section>
  )
}

