import { useParams } from 'react-router'
import PointsDemo, { PointsPanel, usePointsStore } from '@/scenes/points-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson focuses on the chosen declarative point API or direct buffer API.
export default function PointsLesson () {
  const { name } = useParams()
  const { count, size } = usePointsStore()
  const buffer = name === 'PointsBuffer'
  const code = buffer ? `<PointsBuffer positions={positions}><pointsMaterial size={${size}} color='indigo' /></PointsBuffer>\n// positions contains ${count} × 3 numbers` : `<Points limit={200} range={${count}}>\n  <pointsMaterial size={${size}} color='indigo' />\n  <Point ref={pointRef} position={[0, 0, 0]} />\n</Points>\n// pointRef.current instanceof PositionPoint`
  const example = buffer ? `import { Canvas } from '@react-three/fiber'\nimport { PointsBuffer } from '@react-three/drei'\n\n// Provide a packed position buffer directly.\nconst positions = new Float32Array([-1, 0, 0, 0, 1, 0, 1, 0, 0])\n\n// Draw three points in one points object.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><PointsBuffer positions={positions}><pointsMaterial size={0.2} color='indigo' /></PointsBuffer></Canvas></div> }` : `import { Canvas } from '@react-three/fiber'\nimport { Point, Points } from '@react-three/drei'\n\n// Combine declarative points into a single points object.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Points limit={3}><pointsMaterial size={0.2} color='indigo' /><Point position={[-1, 0, 0]} /><Point position={[0, 1, 0]} /><Point position={[1, 0, 0]} /></Points></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={PointsDemo} Panel={PointsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/points' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Points.tsx' />
}
