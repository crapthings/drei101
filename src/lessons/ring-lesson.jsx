import RingDemo, { RingPanel, useRingStore } from '@/scenes/ring-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example draws a three-quarter annular sector in the XY plane.
const example = `import { Canvas } from '@react-three/fiber'
import { Ring } from '@react-three/drei'

// Render an annular sector using angles in radians.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>
    <Ring args={[0.7, 1.8, 32, 1, 0, Math.PI * 1.5]}>
      <meshBasicMaterial color='#6366f1' />
    </Ring>
  </Canvas></div>
}`

// The lesson displays active radii, subdivisions and angles.
export default function RingLesson () {
  const { inner, outer, segments, radial, start, sweep, wireframe } = useRingStore()
  const liveCode = `<Ring args={[${inner.toFixed(1)}, ${outer.toFixed(1)}, ${segments}, ${radial}, ${start} * Math.PI / 180, ${sweep} * Math.PI / 180]}>\n  <meshBasicMaterial color='#6366f1' wireframe={${wireframe}} />\n</Ring>`
  return <LessonLayout lessonKey='ringLesson' Demo={RingDemo} Panel={RingPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
