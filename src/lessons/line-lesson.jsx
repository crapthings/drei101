import LineDemo, { LinePanel, useLineStore } from '@/scenes/line-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example renders four points as a continuous polyline.
const example = `import { Canvas } from '@react-three/fiber'
import { Line } from '@react-three/drei'

// Draw a connected line through four points.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>
    <Line points={[[-3, -1, 0], [-1, 1, 0], [1, -1, 0], [3, 1, 0]]}
      color='#4f46e5' lineWidth={4} />
  </Canvas></div>
}`

// The lesson displays the line configuration currently used by the scene.
export default function LineLesson () {
  const { segments, dashed, width } = useLineStore()
  const liveCode = `<Line\n  key='${segments}'\n  points={[[-3, -1, 0], [-1, 1, 0], [1, -1, 0], [3, 1, 0]]}\n  segments={${segments}} dashed={${dashed}} dashSize={0.35} gapSize={0.2}\n  color='#4f46e5' lineWidth={${width}}\n/>`
  return <LessonLayout lessonKey='lineLesson' Demo={LineDemo} Panel={LinePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/line' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Line.tsx' />
}
