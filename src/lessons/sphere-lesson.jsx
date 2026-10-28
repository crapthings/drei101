import SphereDemo, { SpherePanel, useSphereStore } from '@/scenes/sphere-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example renders a complete sphere with explicit subdivisions.
const example = `import { Canvas } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'

// Render a one-and-a-half-meter-radius sphere.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <Sphere args={[1.5, 32, 16]}><meshStandardMaterial color='#6366f1' /></Sphere>
  </Canvas></div>
}`

// The lesson displays the active angular ranges and subdivisions.
export default function SphereLesson () {
  const { radius, widthSegments, heightSegments, phi, theta, wireframe } = useSphereStore()
  const liveCode = `<Sphere args={[${radius.toFixed(1)}, ${widthSegments}, ${heightSegments}, 0, ${phi} * Math.PI / 180, 0, ${theta} * Math.PI / 180]}\n  rotation={[-0.2, 0.4, 0]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} side={DoubleSide} />\n</Sphere>`
  return <LessonLayout lessonKey='sphereLesson' Demo={SphereDemo} Panel={SpherePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
