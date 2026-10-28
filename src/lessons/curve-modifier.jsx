import CurveModifierDemo, { CurveModifierPanel, useCurveModifierStore } from '@/scenes/curve-modifier'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example bends a subdivided box along a closed Catmull-Rom curve.
const example = `import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { CurveModifier } from '@react-three/drei'
import { CatmullRomCurve3, Vector3 } from 'three'

// Keep the curve and mesh stable while the modifier constructs its Flow.
function Scene () {
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(-2.2, 0, 0), new Vector3(0, 1.4, 0),
    new Vector3(2.2, 0, 0), new Vector3(0, -1.4, 0)
  ], true), [])
  const mesh = useMemo(() => <mesh><boxGeometry args={[2.4, 0.18, 0.18, 80, 1, 1]} />
    <meshStandardMaterial color='#4f46e5' /></mesh>, [])
  return <CurveModifier curve={curve}>{mesh}</CurveModifier>
}

// Render the bent strip with directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} /><Scene />
  </Canvas></div>
}`

// The lesson shows the active path shape and explains the relative flow offset.
export default function CurveModifierLesson () {
  const { height, offset } = useCurveModifierStore()
  const liveCode = `const curve = new CatmullRomCurve3([\n  new Vector3(-2.2, 0, 0), new Vector3(0, ${height.toFixed(1)}, 0),\n  new Vector3(2.2, 0, 0), new Vector3(0, -${height.toFixed(1)}, 0)\n], true)\n\n<CurveModifier ref={flow} curve={curve}>{mesh}</CurveModifier>\n// In useFrame: flow.current.moveAlongCurve(offset - previousOffset)\n// Current normalized offset: ${offset.toFixed(2)}`
  return <LessonLayout lessonKey='curveModifierLesson' Demo={CurveModifierDemo} Panel={CurveModifierPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/modifiers/curve-modifier' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/CurveModifier.tsx' />
}
