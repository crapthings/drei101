import PreloadDemo, { PreloadPanel, usePreloadStore } from '@/scenes/preload-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains scene compilation and the scope of Preload's all option.
export default function PreloadLesson () {
  const { all, visible } = usePreloadStore()
  const code = `<mesh visible={${visible}}>{/* geometry and material */}</mesh>\n<Preload all={${all}} />`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Preload } from '@react-three/drei'\n\n// Compile the visible cube and the hidden sphere.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 5] }}>\n    <directionalLight position={[3, 5, 6]} intensity={3} />\n    <mesh><boxGeometry /><meshStandardMaterial color='#6366f1' /></mesh>\n    <mesh visible={false}><sphereGeometry /><meshStandardMaterial color='#f59e0b' /></mesh>\n    <Preload all />\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='preloadLesson' Demo={PreloadDemo} Panel={PreloadPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/preload' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Preload.tsx' />
}
