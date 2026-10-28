import QuadraticDemo, { QuadraticPanel, useQuadraticStore } from '@/scenes/quadratic-bezier'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example renders an explicit three-point quadratic curve.
const example = `import { Canvas } from '@react-three/fiber'
import { QuadraticBezierLine } from '@react-three/drei'

// Render a quadratic Bézier curve in a front-facing canvas.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>
    <QuadraticBezierLine start={[-3, -1, 0]} mid={[0, 2, 0]}
      end={[3, -1, 0]} segments={20} color='#4f46e5' lineWidth={4} />
  </Canvas></div>
}`

// The lesson connects the live controls with a copyable component configuration.
export default function QuadraticLesson () {
  const { x, y, segments } = useQuadraticStore()
  const liveCode = `<QuadraticBezierLine\n  start={[-3, -1, 0]}\n  mid={[${x.toFixed(1)}, ${y.toFixed(1)}, 0]}\n  end={[3, -1, 0]}\n  segments={${segments}} color='#4f46e5' lineWidth={4}\n/>`
  return <LessonLayout lessonKey='quadraticBezierLineLesson' Demo={QuadraticDemo} Panel={QuadraticPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/quadratic-bezier-line' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/QuadraticBezierLine.tsx' />
}
