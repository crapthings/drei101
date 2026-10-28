import DetailedDemo, { DetailedPanel } from '@/scenes/detailed-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains distance-based geometry selection with Drei Detailed.
export default function DetailedLesson () {
  const code = `<Detailed distances={[0, 8, 14]}>\n  <mesh><sphereGeometry args={[1.5, 48, 32]} /><meshStandardMaterial color='indigo' /></mesh>\n  <mesh><sphereGeometry args={[1.5, 16, 12]} /><meshStandardMaterial color='orange' /></mesh>\n  <mesh><icosahedronGeometry args={[1.5, 0]} /><meshStandardMaterial color='green' /></mesh>\n</Detailed>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Detailed, OrbitControls } from '@react-three/drei'\n\n// Select geometry as the camera distance changes.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 5] }}><directionalLight position={[3, 4, 5]} intensity={3} />${code}<OrbitControls /></Canvas></div> }`
  return <LessonLayout lessonKey='detailedLesson' Demo={DetailedDemo} Panel={DetailedPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/detailed' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Detailed.tsx' />
}
