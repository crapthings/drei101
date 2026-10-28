import CubicDemo, { CubicPanel, useCubicStore } from '@/scenes/cubic-bezier'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example renders a cubic curve with two explicit control points.
const example = `import { Canvas } from '@react-three/fiber'
import { CubicBezierLine } from '@react-three/drei'

// Render a cubic Bézier curve in a front-facing canvas.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>
    <CubicBezierLine start={[-3, -1, 0]} midA={[-1.5, 2, 0]}
      midB={[1.5, -2, 0]} end={[3, -1, 0]} segments={20} color='#4f46e5' lineWidth={4} />
  </Canvas></div>
}`

// The lesson displays the current two control points and sampling count.
export default function CubicLesson () {
  const { ax, ay, bx, by, segments } = useCubicStore()
  const liveCode = `<CubicBezierLine\n  start={[-3, -1, 0]}\n  midA={[${ax.toFixed(1)}, ${ay.toFixed(1)}, 0]}\n  midB={[${bx.toFixed(1)}, ${by.toFixed(1)}, 0]}\n  end={[3, -1, 0]}\n  segments={${segments}} color='#4f46e5' lineWidth={4}\n/>`
  return <LessonLayout lessonKey='cubicBezierLineLesson' Demo={CubicDemo} Panel={CubicPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/cubic-bezier-line' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/CubicBezierLine.tsx' />
}
