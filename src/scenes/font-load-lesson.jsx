import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, useFont } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The local typeface JSON contains the glyph outlines used to generate shapes.
const fontUrl = `${import.meta.env.BASE_URL}fonts/helvetiker_regular.typeface.json`

// The store shares the selected word, extrusion depth and loaded font metadata.
export const useFontLessonStore = create((set) => ({ word: 'DREI', depth: 0.25, family: '', glyphs: 0, setValue: (key, value) => set({ [key]: value }), setFontInfo: (family, glyphs) => set({ family, glyphs }), reset: () => set({ word: 'DREI', depth: 0.25 }) }))

// The model turns the loaded font's glyph outlines into extruded geometry.
function FontModel () {
  const font = useFont(fontUrl)
  const { word, depth, setFontInfo } = useFontLessonStore()
  const shapes = useMemo(() => font.generateShapes(word, 0.9), [font, word])
  useEffect(() => { setFontInfo(font.data.familyName, Object.keys(font.data.glyphs).length); return () => setFontInfo('', 0) }, [font, setFontInfo])
  return <group rotation={[0, -0.3, 0]}><Center cacheKey={`${word}-${depth}`}><mesh><extrudeGeometry args={[shapes, { depth, bevelEnabled: false, curveSegments: 8 }]} /><meshStandardMaterial color='#6366f1' roughness={0.45} /></mesh></Center></group>
}

// The canvas loads the font locally and resets the demonstration on navigation.
export default function FontLoadDemo () {
  const { t } = useTranslation()
  const reset = useFontLessonStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('fontLoadUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.4} minimumDistance={8} frontDepth={1} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, 4]} intensity={0.8} /><Suspense fallback={null}><FontModel /></Suspense></Canvas></div>
}

// The panel switches words, adjusts extrusion depth and displays loaded font metadata.
export function FontLoadPanel () {
  const { t } = useTranslation()
  const state = useFontLessonStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('fontLoadUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><p className='text-xs text-slate-600'>{t('fontLoadUI.word')}</p><div className='grid grid-cols-2 gap-2'>{['DREI', 'FONT'].map((word) => <Button key={word} aria-pressed={state.word === word} onClick={() => state.setValue('word', word)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${state.word === word ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{word}</Button>)}</div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('fontLoadUI.depth')}</span><span className='font-mono'>{state.depth} m</span></span><input type='range' min='0.05' max='0.8' step='0.05' value={state.depth} onChange={(event) => state.setValue('depth', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><div className='space-y-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'><p>{t('fontLoadUI.family')}: <span className='font-mono'>{state.family || '—'}</span></p><p>{t('fontLoadUI.glyphs')}: <span className='font-mono'>{state.glyphs || '—'}</span></p></div></section>
}
