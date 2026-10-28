import PolyhedronDemo, { PolyhedronPanel, usePolyhedronStore } from '@/scenes/polyhedron-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example defines a tetrahedron through raw vertices and triangle indices.
const example = `import { Canvas } from '@react-three/fiber'
import { Polyhedron } from '@react-three/drei'

// Describe four input vertices as consecutive XYZ triples.
const vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1]

// Group the vertex indices in threes to define the four faces.
const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1]

// Render the indexed shape after projecting its vertices onto a sphere.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <Polyhedron args={[vertices, indices, 1.5, 0]} rotation={[-0.3, 0.5, 0]}>
      <meshStandardMaterial color='#6366f1' />
    </Polyhedron>
  </Canvas></div>
}`

// The lesson shows the active input coordinate, radius, subdivision and material.
export default function PolyhedronLesson () {
  const { vertexY, radius, detail, wireframe } = usePolyhedronStore()
  const liveCode = `const vertices = [1, ${vertexY.toFixed(1)}, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1]\nconst indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1]\n\n<Polyhedron args={[vertices, indices, ${radius.toFixed(1)}, ${detail}]} rotation={[-0.3, 0.5, 0]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} />\n</Polyhedron>`
  return <LessonLayout lessonKey='polyhedronLesson' Demo={PolyhedronDemo} Panel={PolyhedronPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
