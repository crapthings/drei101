import { useParams } from 'react-router'
import PlatonicDemo, { PlatonicPanel, usePlatonicStore } from '@/scenes/platonic-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// Each lesson renders its own Drei component with the shared radius and detail controls.
export default function PlatonicLesson () {
  const { name } = useParams()
  const { radius, detail, wireframe } = usePlatonicStore()
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Render a polyhedron with directional lighting.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    <${name} args={[1.5, 0]} rotation={[-0.3, 0.5, 0]}>\n      <meshStandardMaterial color='#6366f1' />\n    </${name}>\n  </Canvas></div>\n}`
  const liveCode = `<${name} args={[${radius.toFixed(1)}, ${detail}]} rotation={[-0.3, 0.5, 0]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} />\n</${name}>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={PlatonicDemo} Panel={PlatonicPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
