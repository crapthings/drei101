import AsciiDemo, { AsciiPanel, useAsciiStore } from '@/scenes/ascii-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains replacing the canvas image with character-based output.
export default function AsciiLesson () {
  const { enabled, resolution, speed } = useAsciiStore()
  const code = enabled ? `<AsciiRenderer resolution={${resolution}} fgColor='#4338ca' bgColor='#eef2ff' />\n// Rotation speed: ${speed} rad/s` : '// AsciiRenderer is disabled.'
  const example = `import { Canvas } from '@react-three/fiber'\nimport { AsciiRenderer } from '@react-three/drei'\n\n// Render the scene as characters in an overlay.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    <mesh><torusKnotGeometry /><meshStandardMaterial color='#a5b4fc' /></mesh>\n    <AsciiRenderer resolution={0.15} fgColor='#4338ca' bgColor='#eef2ff' />\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='asciiLesson' Demo={AsciiDemo} Panel={AsciiPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/misc/ascii-renderer' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/AsciiRenderer.tsx' />
}
