import CapsuleDemo, { CapsulePanel, useCapsuleStore } from '@/scenes/capsule-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example creates a capsule with a 0.7-meter radius and a 1.4-meter middle section.
const example = `import { Canvas } from '@react-three/fiber'
import { Capsule } from '@react-three/drei'

// Render a capsule with a material and directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <Capsule args={[0.7, 1.4, 4, 12, 1]} rotation={[0, 0, 0.2]}>
      <meshStandardMaterial color='#6366f1' />
    </Capsule>
  </Canvas></div>
}`

// The lesson displays current dimensions and subdivision arguments.
export default function CapsuleLesson () {
  const { radius, length, capSegments, radialSegments, heightSegments, wireframe } = useCapsuleStore()
  const liveCode = `<Capsule args={[${radius.toFixed(1)}, ${length.toFixed(1)}, ${capSegments}, ${radialSegments}, ${heightSegments}]}\n  rotation={[0, 0, 0.2]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} />\n</Capsule>`
  return <LessonLayout lessonKey='capsuleLesson' Demo={CapsuleDemo} Panel={CapsulePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
