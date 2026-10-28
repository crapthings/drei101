import { useParams } from 'react-router'
import TextDemo, { TextPanel, useTextStore } from '@/scenes/text-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// Each text lesson shows the component and local font appropriate to its rendering model.
export default function TextLesson () {
  const { name } = useParams()
  const { size, width, spacing, align, depth, bevel } = useTextStore()
  const is3D = name === 'Text3D'
  const example = is3D
    ? `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { Text3D } from '@react-three/drei'\n\n// Render extruded glyph geometry using a Three.js typeface JSON font.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    <Suspense fallback={null}><Text3D font='/fonts/helvetiker_regular.typeface.json' size={0.7} height={0.3}>\n      <meshStandardMaterial color='#6366f1' />DREI\n    </Text3D></Suspense>\n  </Canvas></div>\n}`
    : `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { Text } from '@react-three/drei'\n\n// Render SDF text using a local font.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>\n    <Suspense fallback={null}><Text font='/fonts/roboto-regular.ttf' fontSize={0.7}\n      maxWidth={3} color='#4f46e5'>THREE DIMENSIONAL TYPE</Text></Suspense>\n  </Canvas></div>\n}`
  const liveCode = is3D
    ? `<group rotation={[0, -0.35, 0]}>\n<Center cacheKey='${size}-${depth}-${bevel}'>\n  <Text3D font={fontUrl} size={${size.toFixed(2)}} height={${depth.toFixed(2)}}\n    bevelEnabled={${bevel}} bevelSize={0.04} bevelThickness={0.04} bevelSegments={3} curveSegments={8}>\n    <meshStandardMaterial color='#6366f1' roughness={0.4} />DREI\n  </Text3D>\n</Center>\n</group>`
    : `<Text font={fontUrl} fontSize={${size.toFixed(2)}} maxWidth={${width.toFixed(2)}}\n  letterSpacing={${spacing.toFixed(2)}} textAlign='${align}' anchorX='center' anchorY='middle' color='#4f46e5'>\n  {'THREE DIMENSIONAL\\nTYPE IN SPACE'}\n</Text>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={TextDemo} Panel={TextPanel} minimalCode={example} liveCode={liveCode} docs={is3D ? 'https://drei.docs.pmnd.rs/abstractions/text3d' : 'https://drei.docs.pmnd.rs/abstractions/text'} referenceUrl={is3D ? 'https://github.com/pmndrs/drei/blob/master/src/core/Text3D.tsx' : 'https://github.com/pmndrs/drei/blob/master/src/core/Text.tsx'} />
}
