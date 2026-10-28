import { useParams } from 'react-router'
import SegmentsDemo, { SegmentsPanel, useSegmentsStore } from '@/scenes/segments-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the segment batch, child component or backing data object.
export default function SegmentsLesson () {
  const { name } = useParams()
  const { count, width, length } = useSegmentsStore()
  const code = `<Segments limit={${count}} lineWidth={${width}}>\n  <Segment ref={segmentRef} start={[0.35, 0, 0]} end={[${length}, 0, 0]} color='#4f46e5' />\n  {/* ${count} segments in total */}\n</Segments>\n// segmentRef.current instanceof SegmentObject`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Segment, Segments } from '@react-three/drei'\n\n// Draw independent line segments in one batch.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <Segments limit={2} lineWidth={2}>\n      <Segment start={[-1, 0, 0]} end={[0, 1, 0]} color='indigo' />\n      <Segment start={[0, 1, 0]} end={[1, 0, 0]} color='orange' />\n    </Segments>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={SegmentsDemo} Panel={SegmentsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/segments' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Segments.tsx' />
}
