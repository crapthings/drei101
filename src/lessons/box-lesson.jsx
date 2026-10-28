import BoxDemo, { BoxPanel, useBoxStore } from '@/scenes/box-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example creates a two-by-one-and-a-half-by-one-meter box.
const example = `import { Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'

// Render a box with a material and directional lighting.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>
    <directionalLight position={[3, 5, 5]} intensity={3} />
    <Box args={[2, 1.5, 1]} rotation={[-0.25, 0.55, 0]}>
      <meshStandardMaterial color='#6366f1' />
    </Box>
  </Canvas></div>
}`

// The lesson displays the current geometry arguments and wireframe setting.
export default function BoxLesson () {
  const { width, height, depth, segments, wireframe } = useBoxStore()
  const liveCode = `<Box args={[${width.toFixed(1)}, ${height.toFixed(1)}, ${depth.toFixed(1)}, ${segments}, ${segments}, ${segments}]}\n  rotation={[-0.25, 0.55, 0]}>\n  <meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} />\n</Box>`
  return <LessonLayout lessonKey='boxLesson' Demo={BoxDemo} Panel={BoxPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/mesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/shapes.tsx' />
}
