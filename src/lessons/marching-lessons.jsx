import { useParams } from 'react-router'
import MarchingDemo, { MarchingPanel, useMarchingStore } from '@/scenes/marching-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example adds ball and plane field sources to a marching-cubes surface.
const example = `import { Canvas } from '@react-three/fiber'
import { MarchingCube, MarchingCubes, MarchingPlane } from '@react-three/drei'

// Render two balls and a plane inside their shared surface.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 5] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <MarchingCubes resolution={28}>
      <meshStandardMaterial color='#6366f1' />
      <MarchingCube position={[-0.4, 0, 0]} />
      <MarchingCube position={[0.4, 0, 0]} />
      <MarchingPlane planeType='y' />
    </MarchingCubes>
  </Canvas></div>
}`

// Related exports share the experiment while retaining separate explanations.
export default function MarchingLesson () {
  const { name } = useParams()
  const { distance, strength, resolution, plane } = useMarchingStore()
  const liveCode = `<MarchingCubes key={${resolution}} resolution={${resolution}} maxPolyCount={30000}>\n  <meshStandardMaterial color='#6366f1' roughness={0.32} metalness={0.05} />\n  <MarchingCube position={[${(-distance / 2).toFixed(2)}, 0, 0]} strength={${strength.toFixed(2)}} subtract={12} />\n  <MarchingCube position={[${(distance / 2).toFixed(2)}, 0, 0]} strength={${strength.toFixed(2)}} subtract={12} />\n  ${plane ? "<MarchingPlane planeType='y' strength={0.5} subtract={12} />" : '{/* no plane source */}'}\n</MarchingCubes>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={MarchingDemo} Panel={MarchingPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/abstractions/marching-cubes' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/MarchingCubes.tsx' />
}
