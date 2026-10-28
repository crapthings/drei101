import { useParams } from 'react-router'
import ConeCylinderDemo, { ConeCylinderPanel, useConeCylinderStore } from '@/scenes/cone-cylinder'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example renders a cylinder using explicit top and bottom radii.
const cylinderExample = `import { Canvas } from '@react-three/fiber'
import { Cylinder } from '@react-three/drei'

// Render a tapered cylinder with directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <Cylinder args={[0.8, 1.1, 2, 24]} rotation={[-0.3, 0.45, 0]}>
      <meshStandardMaterial color='#6366f1' />
    </Cylinder>
  </Canvas></div>
}`

// The example renders a cone using its base radius and height.
const coneExample = `import { Canvas } from '@react-three/fiber'
import { Cone } from '@react-three/drei'

// Render a cone with directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <Cone args={[1.1, 2, 24]} rotation={[-0.3, 0.45, 0]}>
      <meshStandardMaterial color='#6366f1' />
    </Cone>
  </Canvas></div>
}`

// The lessons expose their own argument order while sharing the same controls.
export default function ConeCylinderLesson () {
  const { name } = useParams()
  const { top, bottom, height, radial, vertical, sweep, open, wireframe } = useConeCylinderStore()
  const args = `${name === 'Cylinder' ? `${top.toFixed(1)}, ` : ''}${bottom.toFixed(1)}, ${height.toFixed(1)}, ${radial}, ${vertical}, ${open}, 0, ${sweep} * Math.PI / 180`
  const liveCode = `<${name} args={[${args}]} rotation={[-0.3, 0.45, 0]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} side={DoubleSide} />\n</${name}>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={ConeCylinderDemo} Panel={ConeCylinderPanel} minimalCode={name === 'Cone' ? coneExample : cylinderExample} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
