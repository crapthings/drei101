import BakeShadowsDemo, { BakeShadowsPanel, useBakeStore } from '@/scenes/bake-shadows-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains freezing and restoring automatic shadow-map updates.
export default function BakeShadowsLesson () {
  const { x, baked } = useBakeStore()
  const code = `<Canvas shadows>\n  <directionalLight castShadow position={[3, 6, 4]} />\n  <mesh castShadow position={[${x}, 1, 0]}><boxGeometry args={[1.4, 2, 1.4]} /><meshStandardMaterial /></mesh>\n  <mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[10, 10]} /><meshStandardMaterial /></mesh>\n  ${baked ? '<BakeShadows />' : '{/* Automatic shadow updates are enabled. */}'}\n</Canvas>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { BakeShadows } from '@react-three/drei'\n\n// Render a static shadow once and stop automatic shadow-map updates.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas shadows camera={{ position: [5, 4, 8] }}><directionalLight castShadow position={[3, 6, 4]} intensity={3} /><mesh castShadow position={[0, 1, 0]}><boxGeometry args={[1.4, 2, 1.4]} /><meshStandardMaterial color='indigo' /></mesh><mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[10, 10]} /><meshStandardMaterial color='white' /></mesh><BakeShadows /></Canvas></div> }`
  return <LessonLayout lessonKey='bakeShadowsLesson' Demo={BakeShadowsDemo} Panel={BakeShadowsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/bake-shadows' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/BakeShadows.tsx' />
}
