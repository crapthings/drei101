import HudDemo, { HudPanel, useHudStore } from '@/scenes/hud-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains rendering an independent scene over the main canvas.
export default function HudLesson () {
  const { angle, visible } = useHudStore()
  const code = `${visible ? "<Hud renderPriority={1}>\n  <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />\n  <mesh><circleGeometry args={[0.4, 48]} /><meshBasicMaterial color='indigo' /></mesh>\n</Hud>" : '// HUD is hidden.'}\n// Main camera angle: ${angle}°`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Hud, OrthographicCamera } from '@react-three/drei'\n\n// Render a marker in a separate overlay scene.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <mesh><boxGeometry /><meshNormalMaterial /></mesh>\n    <Hud><OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />\n      <mesh><circleGeometry args={[0.4, 48]} /><meshBasicMaterial color='indigo' /></mesh>\n    </Hud>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='hudLesson' Demo={HudDemo} Panel={HudPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/portals/hud' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Hud.tsx' />
}
