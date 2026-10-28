import { useParams } from 'react-router'
import RoundedBoxDemo, { RoundedBoxPanel, useRoundedBoxStore } from '@/scenes/rounded-box-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// Each page shows its own mesh or geometry composition with current settings.
export default function RoundedBoxLesson () {
  const { name } = useParams()
  const { width, height, depth, radius, bevelSegments, wireframe } = useRoundedBoxStore()
  const geometry = name === 'RoundedBoxGeometry'
  const wrapper = (args, rad, bevel, material) => geometry
    ? `<mesh rotation={[-0.25, 0.55, 0]}>\n      <RoundedBoxGeometry args={${args}} radius={${rad}} bevelSegments={${bevel}} />\n      ${material}\n    </mesh>`
    : `<RoundedBox args={${args}} radius={${rad}} bevelSegments={${bevel}} rotation={[-0.25, 0.55, 0]}>\n      ${material}\n    </RoundedBox>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Render a rounded box with directional lighting.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    ${wrapper('[2, 1.5, 1.2]', '0.2', '4', "<meshStandardMaterial color='#6366f1' />")}\n  </Canvas></div>\n}`
  const liveCode = wrapper(`[${width.toFixed(1)}, ${height.toFixed(1)}, ${depth.toFixed(1)}]`, radius.toFixed(2), String(bevelSegments), `<meshStandardMaterial color='#6366f1' roughness={0.45} wireframe={${wireframe}} />`)
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={RoundedBoxDemo} Panel={RoundedBoxPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/rounded-box' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/RoundedBox.tsx' />
}
