import { useEffect, useRef, useState } from 'react'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

// The shared reading order defines the chapter headings and in-page navigation.
const chapters = ['concept', 'purpose', 'demo', 'applications', 'boundaries', 'code', 'parameters']

// Repeated explanation cards keep conceptual and business sections easy to scan.
function ExplanationCards ({ items, columns = 3 }) {
  return (
    <div className={`grid gap-4 ${columns === 3 ? '2xl:grid-cols-3' : ''}`}>
      {items.map((item) => (
        <div key={item.title} className='rounded-xl border border-slate-200 bg-white p-5'>
          <h3 className='mb-2 text-sm font-semibold text-slate-900'>{item.title}</h3>
          <p className='text-sm leading-7 text-slate-600'>{item.body}</p>
        </div>
      ))}
    </div>
  )
}

// Source examples use a light code surface with horizontal scrolling on narrow screens.
function CodeBlock ({ title, children }) {
  return (
    <div className='min-w-0 overflow-hidden rounded-xl border border-indigo-100 bg-white'>
      <div className='border-b border-indigo-100 bg-indigo-50/60 px-5 py-3 text-xs font-medium text-indigo-700'>{title}<span className='float-right font-mono text-indigo-400'>JSX</span></div>
      <pre className='overflow-x-auto p-5 text-xs leading-7 text-slate-700' tabIndex={0}><code>{children}</code></pre>
    </div>
  )
}

// Seven chapters provide a consistent learning layout for each camera demonstration.
export function LessonLayout ({ lessonKey, Demo, Panel, minimalCode, liveCode, docs, cameraType, referenceUrl }) {
  const { t } = useTranslation()
  const lesson = t(lessonKey, { returnObjects: true })
  const article = useRef(null)
  const outline = useRef(null)
  const [active, setActive] = useState('concept')

  useEffect(() => {
    const updateChapter = () => {
      const sections = Array.from(article.current?.querySelectorAll('[data-chapter]') || [])
      let current = sections[0]?.dataset.chapter
      const readingLine = window.matchMedia('(min-width: 1440px)').matches ? 150 : (outline.current?.getBoundingClientRect().bottom || 180) + 64
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) current = section.dataset.chapter
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) current = chapters[chapters.length - 1]
      if (current) setActive(current)
    }
    updateChapter()
    window.addEventListener('scroll', updateChapter, { passive: true })
    window.addEventListener('resize', updateChapter)
    return () => {
      window.removeEventListener('scroll', updateChapter)
      window.removeEventListener('resize', updateChapter)
    }
  }, [])

  const content = {
    concept: <><p className='text-lg font-medium text-slate-900'>{lesson.conceptLead}</p><p className='max-w-3xl text-sm leading-8 text-slate-600'>{lesson.conceptBody}</p>{lesson.conceptDetails?.map((paragraph) => <p key={paragraph} className='max-w-3xl text-sm leading-8 text-slate-600'>{paragraph}</p>)}<ExplanationCards items={lesson.conceptCards} /></>,
    purpose: <><p className='text-lg font-medium text-slate-900'>{lesson.purposeLead}</p><p className='max-w-3xl text-sm leading-8 text-slate-600'>{lesson.purposeBody}</p>{lesson.purposeDetails?.map((paragraph) => <p key={paragraph} className='max-w-3xl text-sm leading-8 text-slate-600'>{paragraph}</p>)}<ExplanationCards items={lesson.purposeCards} /></>,
    demo: <><p className='text-lg font-medium text-slate-900'>{lesson.demoLead}</p><p className='text-sm leading-8 text-slate-600'>{lesson.demoBody}</p><div className='grid items-start gap-4 min-[1600px]:grid-cols-[minmax(0,1fr)_260px]'><Demo /><Panel /></div><ExplanationCards items={lesson.experiments} /></>,
    parameters: <><p className='text-lg font-medium text-slate-900'>{lesson.parameterLead}</p><p className='text-sm leading-8 text-slate-600'>{lesson.parameterNote}</p><div className='overflow-x-auto rounded-xl border border-slate-200 bg-white'><table className='w-full min-w-[680px] text-left text-xs leading-6'><thead className='border-b border-indigo-100 bg-indigo-50/70 text-indigo-900'><tr>{lesson.columns.map((column) => <th key={column} scope='col' className='px-4 py-3 font-medium'>{column}</th>)}</tr></thead><tbody className='divide-y divide-slate-100'>{lesson.parameters.map((row) => <tr key={row[0]} className='align-top'>{row.map((cell, index) => index === 0 ? <th key={index} scope='row' className='px-4 py-4 font-mono font-medium text-indigo-700'>{cell}</th> : <td key={index} className={`px-4 py-4 text-slate-600 ${index < 3 ? 'whitespace-nowrap font-mono' : 'min-w-64'}`}>{cell}</td>)}</tr>)}</tbody></table></div></>,
    code: <><p className='text-lg font-medium text-slate-900'>{lesson.codeLead}</p>{lesson.codeDetails?.map((paragraph) => <p key={paragraph} className='max-w-3xl text-sm leading-8 text-slate-600'>{paragraph}</p>)}<CodeBlock title={lesson.minimal}>{minimalCode}</CodeBlock><CodeBlock title={lesson.live}>{liveCode}</CodeBlock><ExplanationCards items={lesson.codeNotes} /></>,
    applications: <><p className='text-lg font-medium text-slate-900'>{lesson.applicationsLead}</p><ExplanationCards items={lesson.applications} columns={1} /></>,
    boundaries: <><p className='text-lg font-medium text-slate-900'>{lesson.boundariesLead}</p><ExplanationCards items={lesson.boundaries} columns={1} /></>
  }

  return (
    <div className='relative grid items-start gap-10 min-[1440px]:grid-cols-[152px_minmax(0,1fr)]'>
      <nav ref={outline} aria-label={lesson.nav} className='sticky top-[130px] z-10 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-indigo-100 bg-white/95 p-2 backdrop-blur md:top-20 min-[1440px]:flex-col min-[1440px]:border-0 min-[1440px]:bg-transparent min-[1440px]:p-0'>
        <p className='mb-4 hidden px-3 text-xs font-semibold text-slate-900 min-[1440px]:block'>{lesson.nav}</p>
        {chapters.map((chapter, index) => <Button key={chapter} aria-current={active === chapter ? 'location' : undefined} onClick={() => { const section = document.getElementById(`lesson-${chapter}`); section?.scrollIntoView({ block: 'start', behavior: 'instant' }); section?.focus({ preventScroll: true }); setActive(chapter) }} className={`flex shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${active === chapter ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}><span className='font-mono text-[10px] opacity-60'>{String(index + 1).padStart(2, '0')}</span>{lesson.sections[chapter]}</Button>)}
      </nav>
      <article ref={article} className='min-w-0 space-y-14'>
        <p className='font-mono text-[11px] tracking-widest text-indigo-500'>{lesson.eyebrow}</p>
        {chapters.map((chapter, index) => <section key={chapter} id={`lesson-${chapter}`} data-chapter={chapter} tabIndex={-1} aria-labelledby={`heading-${chapter}`} className='scroll-mt-52 space-y-5 border-t border-slate-200 pt-7 focus-visible:outline-2 focus-visible:outline-indigo-500 md:scroll-mt-40 min-[1440px]:scroll-mt-28'><h2 id={`heading-${chapter}`} className='flex items-center gap-3 text-xl font-semibold tracking-tight'><span className='flex size-8 items-center justify-center rounded-lg bg-indigo-100/70 font-mono text-xs font-normal text-indigo-600'>{String(index + 1).padStart(2, '0')}</span>{lesson.sections[chapter]}</h2>{content[chapter]}</section>)}
        <footer className='border-t border-slate-200 pt-6 text-xs text-slate-500'><p className='mb-3'>{lesson.sources}</p><div className='flex flex-wrap gap-5'><a className='text-indigo-600 hover:underline' href={docs} target='_blank' rel='noreferrer'>{lesson.dreiDocs}</a><a className='text-indigo-600 hover:underline' href={referenceUrl || `https://threejs.org/docs/pages/${cameraType}.html`} target='_blank' rel='noreferrer'>{lesson.threeDocs}</a></div></footer>
      </article>
    </div>
  )
}
