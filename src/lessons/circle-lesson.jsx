import CircleDemo, { CirclePanel, useCircleStore } from '@/scenes/circle-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example draws a three-quarter circle in the XY plane.
const example = `import { Canvas } from '@react-three/fiber'
import { Circle } from '@react-three/drei'

// Render a circle sector using angles in radians.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>
    <Circle args={[1.8, 32, 0, Math.PI * 1.5]}>
      <meshBasicMaterial color='#6366f1' />
    </Circle>
  </Canvas></div>
}`

// The lesson displays current sector angles converted from degrees to radians.
export default function CircleLesson () {
  const { radius, segments, start, sweep, wireframe } = useCircleStore()
  const liveCode = `<Circle args={[${radius.toFixed(1)}, ${segments}, ${start} * Math.PI / 180, ${sweep} * Math.PI / 180]}>\n  <meshBasicMaterial color='#6366f1' wireframe={${wireframe}} />\n</Circle>`
  return <LessonLayout lessonKey='circleLesson' Demo={CircleDemo} Panel={CirclePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
