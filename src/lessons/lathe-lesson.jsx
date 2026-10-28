import LatheDemo, { LathePanel, useLatheStore } from '@/scenes/lathe-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example revolves a four-point profile around the Y axis.
const example = `import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Lathe } from '@react-three/drei'
import { Vector2 } from 'three'

// Define an ordered radius-height profile and revolve it once.
function Scene () {
  const points = useMemo(() => [new Vector2(0.5, -1.3), new Vector2(1.1, -0.5),
    new Vector2(0.7, 0.5), new Vector2(0.45, 1.3)], [])
  return <Lathe args={[points, 32]}><meshStandardMaterial color='#6366f1' /></Lathe>
}

// Render the surface with directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} /><Scene />
  </Canvas></div>
}`

// The lesson displays the active profile, angular range and material settings.
export default function LatheLesson () {
  const { waist, segments, sweep, wireframe } = useLatheStore()
  const liveCode = `const points = [new Vector2(0.5, -1.3), new Vector2(${waist.toFixed(1)}, -0.5),\n  new Vector2(0.7, 0.5), new Vector2(0.45, 1.3)]\n\n<group rotation={[0, Math.PI / 2, 0]}>\n  <Lathe args={[points, ${segments}, 0, ${sweep} * Math.PI / 180]}>\n    <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} side={DoubleSide} />\n  </Lathe>\n  {/* Profile guide omitted */}\n</group>`
  return <LessonLayout lessonKey='latheLesson' Demo={LatheDemo} Panel={LathePanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
