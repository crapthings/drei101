import MeshBoundsDemo, { MeshBoundsPanel } from '@/scenes/mesh-bounds-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson contrasts bounding-volume raycasts with precise triangle intersections.
export default function MeshBoundsLesson () {
  const code = `<mesh raycast={meshBounds}>\n  <torusGeometry args={[1.3, 0.45, 80, 160]} />\n  <meshStandardMaterial color='indigo' />\n</mesh>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { meshBounds } from '@react-three/drei'\n\n// Use an approximate bounds-based raycast for pointer events.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><mesh raycast={meshBounds} onClick={() => console.log('bounds hit')}><torusGeometry args={[1.3, 0.45, 80, 160]} /><meshBasicMaterial color='indigo' /></mesh></Canvas></div> }`
  return <LessonLayout lessonKey='meshBoundsLesson' Demo={MeshBoundsDemo} Panel={MeshBoundsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/mesh-bounds' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/meshBounds.tsx' />
}
