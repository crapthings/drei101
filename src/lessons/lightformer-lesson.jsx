import LightformerDemo, { LightformerPanel, useLightformerStore } from '@/scenes/lightformer-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains how emissive shapes become reflections in an environment map.
export default function LightformerLesson () {
  const { form, intensity, x } = useLightformerStore()
  const code = `<Environment frames={1} resolution={256}>\n  <Lightformer form='${form}' intensity={${intensity}} position={[${x}, 2, 4]} scale={[3, 2, 1]} target={[0, 0, 0]} />\n</Environment>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Environment, Lightformer } from '@react-three/drei'\n\n// Capture an emissive panel and reflect it in a metallic sphere.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    ${code}\n    <mesh><sphereGeometry args={[1.4, 64, 48]} /><meshStandardMaterial color='white' metalness={1} roughness={0.16} /></mesh>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='lightformerLesson' Demo={LightformerDemo} Panel={LightformerPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/staging/lightformer' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Lightformer.tsx' />
}
