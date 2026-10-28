import TubeDemo, { TubePanel, useTubeStore } from '@/scenes/tube-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example constructs a tube from an open cubic Bézier curve.
const example = `import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Tube } from '@react-three/drei'
import { CubicBezierCurve3, Vector3 } from 'three'

// Define an open path and generate a tube around it.
function Scene () {
  const curve = useMemo(() => new CubicBezierCurve3(
    new Vector3(-3, -0.5, 0), new Vector3(-1.5, 2, 0),
    new Vector3(1.5, -2, 0), new Vector3(3, 0.5, 0)
  ), [])
  return <Tube args={[curve, 64, 0.25, 12, false]}><meshStandardMaterial color='#6366f1' /></Tube>
}

// Render the path geometry with directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} /><Scene />
  </Canvas></div>
}`

// The lesson displays current path and tube geometry arguments.
export default function TubeLesson () {
  const { bend, radius, tubular, radial, wireframe } = useTubeStore()
  const liveCode = `const curve = new CubicBezierCurve3(\n  new Vector3(-3, -0.5, 0), new Vector3(-1.5, ${bend.toFixed(1)}, 0),\n  new Vector3(1.5, -${bend.toFixed(1)}, 0), new Vector3(3, 0.5, 0)\n)\n\n<Tube args={[curve, ${tubular}, ${radius.toFixed(2)}, ${radial}, false]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} />\n</Tube>`
  return <LessonLayout lessonKey='tubeLesson' Demo={TubeDemo} Panel={TubePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
