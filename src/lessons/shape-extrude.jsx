import { useParams } from 'react-router'
import ShapeExtrudeDemo, { ShapeExtrudePanel, useShapeExtrudeStore } from '@/scenes/shape-extrude'
import { LessonLayout } from '@/lessons/lesson-layout'

// Each lesson renders its own component using the same contour with a circular hole.
export default function ShapeExtrudeLesson () {
  const { name } = useParams()
  const { hole, curveSegments, depth, bevel, wireframe } = useShapeExtrudeStore()
  const component = name === 'Shape' ? 'Shape as DreiShape' : 'Extrude'
  const tag = name === 'Shape' ? 'DreiShape' : 'Extrude'
  const args = name === 'Shape' ? '[outline, 24]' : '[outline, { depth: 0.8, bevelEnabled: false }]'
  const example = `import { useMemo } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${component} } from '@react-three/drei'\nimport { Path, Shape } from 'three'\n\n// Create a rectangular contour with a circular hole.\nfunction Scene () {\n  const outline = useMemo(() => {\n    const s = new Shape()\n    s.moveTo(-1.3, -1)\n    s.lineTo(1.3, -1)\n    s.lineTo(1.3, 1)\n    s.lineTo(-1.3, 1)\n    s.closePath()\n    const hole = new Path()\n    hole.absarc(0, 0, 0.45, 0, Math.PI * 2, true)\n    s.holes.push(hole)\n    return s\n  }, [])\n  return <${tag} args={${args}}><meshStandardMaterial color='#6366f1' /></${tag}>\n}\n\n// Render the shape with directional lighting.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} /><Scene />\n  </Canvas></div>\n}`
  const liveArgs = name === 'Shape' ? `[outline, ${curveSegments}]` : `[outline, { depth: ${depth.toFixed(2)}, steps: 1, curveSegments: ${curveSegments}, bevelEnabled: ${bevel}, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 3 }]`
  const liveTransform = name === 'Shape' ? '' : ` rotation={[-0.2, 0.45, 0]} position={[0, 0, -${depth.toFixed(2)} / 2]}`
  const liveCode = `// outline: rectangle with a circular hole of radius ${hole.toFixed(2)} m\n<${tag} args={${liveArgs}}${liveTransform}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} side={DoubleSide} />\n</${tag}>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={ShapeExtrudeDemo} Panel={ShapeExtrudePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
