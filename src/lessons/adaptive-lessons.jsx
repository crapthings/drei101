import { useParams } from 'react-router'
import AdaptiveDemo, { AdaptivePanel } from '@/scenes/adaptive-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains adapting pixel ratio or events to R3F performance state.
export default function AdaptiveLesson () {
  const { name } = useParams()
  const dpr = name === 'AdaptiveDpr'
  const code = `<Canvas performance={{ min: 0.5, debounce: 8000 }}>\n  <${name}${dpr ? ' pixelated' : ''} />\n  {/* Call performance.regress() when interaction begins. */}\n</Canvas>`
  const example = `import { useThree, Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Trigger a temporary performance regression on pointer movement.\nfunction Scene () {\n  const regress = useThree((state) => state.performance.regress)\n  return <><${name}${dpr ? ' pixelated' : ''} /><mesh onPointerMove={regress}><boxGeometry /><meshBasicMaterial color='indigo' /></mesh></>\n}\n\n// Render the scene with adaptive behavior.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas performance={{ min: 0.5, debounce: 1000 }}><Scene /></Canvas></div> }`
  return <LessonLayout lessonKey={dpr ? 'adaptiveDprLesson' : 'adaptiveEventsLesson'} Demo={AdaptiveDemo} Panel={AdaptivePanel} minimalCode={example} liveCode={code} docs={`https://drei.docs.pmnd.rs/performances/${dpr ? 'adaptive-dpr' : 'adaptive-events'}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`} />
}
