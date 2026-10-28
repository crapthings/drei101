import { useParams } from 'react-router'
import TorusDemo, { TorusPanel, useTorusStore } from '@/scenes/torus-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// Each route shows its actual argument order and a standalone geometry example.
export default function TorusLesson () {
  const { name } = useParams()
  const { radius, tube, radial, tubular, arc, alternateKnot, wireframe } = useTorusStore()
  const exampleArgs = name === 'Torus' ? '1.2, 0.3, 12, 64' : '1.2, 0.3, 64, 12, 2, 3'
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Render the shape with directional lighting.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 9] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    <${name} args={[${exampleArgs}]} rotation={[-0.25, 0.35, 0]}>\n      <meshStandardMaterial color='#6366f1' />\n    </${name}>\n  </Canvas></div>\n}`
  const args = name === 'Torus' ? `${radius.toFixed(2)}, ${tube.toFixed(2)}, ${radial}, ${tubular}, ${arc} * Math.PI / 180` : `${radius.toFixed(2)}, ${tube.toFixed(2)}, ${tubular}, ${radial}, ${alternateKnot ? 3 : 2}, ${alternateKnot ? 4 : 3}`
  const liveCode = `<${name} args={[${args}]} rotation={[-0.25, 0.35, 0]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.4} wireframe={${wireframe}} side={DoubleSide} />\n</${name}>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={TorusDemo} Panel={TorusPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
