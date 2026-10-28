import PlaneDemo, { PlanePanel, usePlaneStore } from '@/scenes/plane-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example creates a three-by-two-meter plane in the XY plane.
const example = `import { Canvas } from '@react-three/fiber'
import { Plane } from '@react-three/drei'

// Render a plane with a material and directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <Plane args={[3, 2, 1, 1]}><meshStandardMaterial color='#6366f1' /></Plane>
  </Canvas></div>
}`

// The lesson displays current dimensions and subdivision arguments.
export default function PlaneLesson () {
  const { width, height, widthSegments, heightSegments, wireframe } = usePlaneStore()
  const liveCode = `<Plane args={[${width.toFixed(1)}, ${height.toFixed(1)}, ${widthSegments}, ${heightSegments}]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} />\n</Plane>`
  return <LessonLayout lessonKey='planeLesson' Demo={PlaneDemo} Panel={PlanePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
