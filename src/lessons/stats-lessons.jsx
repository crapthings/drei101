import { useParams } from 'react-router'
import StatsLessonDemo, { StatsLessonPanel } from '@/scenes/stats-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the selected frame or GPU monitoring widget.
export default function StatsLesson () {
  const { name } = useParams()
  const code = name === 'Stats' ? `<Stats parent={overlayRef} className='!absolute !left-0 !top-0' />` : '<StatsGl parent={overlayRef} />'
  const example = `import { useRef } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Mount a performance widget in an overlay above the canvas.\nexport default function Example () {\n  const overlayRef = useRef()\n  return <div style={{ position: 'relative', height: 400 }}><div ref={overlayRef} style={{ position: 'absolute', zIndex: 1 }} /><Canvas><mesh><boxGeometry /><meshBasicMaterial color='indigo' /></mesh>${code}</Canvas></div>\n}`
  return <LessonLayout lessonKey={name === 'Stats' ? 'statsLesson' : 'statsGlLesson'} Demo={StatsLessonDemo} Panel={StatsLessonPanel} minimalCode={example} liveCode={code} docs={`https://drei.docs.pmnd.rs/performances/${name === 'Stats' ? 'stats' : 'stats-gl'}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`} />
}
