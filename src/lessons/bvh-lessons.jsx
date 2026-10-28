import { useParams } from 'react-router'
import BvhDemo, { BvhPanel, useBvhStore } from '@/scenes/bvh-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains component or hook based raycast acceleration.
export default function BvhLesson () {
  const { name } = useParams()
  const enabled = useBvhStore((state) => state.enabled)
  const hook = name === 'useBVH'
  const code = hook ? `const mesh = useRef()\n${enabled ? 'useBVH(mesh)' : '// Acceleration is disabled.'}\n<mesh ref={mesh}><sphereGeometry args={[1.6, 256, 128]} /><meshStandardMaterial /></mesh>` : `<Bvh enabled={${enabled}}>\n  <mesh><sphereGeometry args={[1.6, 256, 128]} /><meshStandardMaterial /></mesh>\n</Bvh>`
  const example = `import { useRef } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Attach acceleration to a high-resolution mesh.\nfunction Model () {\n  ${hook ? "const mesh = useRef()\n  useBVH(mesh)\n  return <mesh ref={mesh}><sphereGeometry args={[1.6, 256, 128]} /><meshBasicMaterial color='indigo' /></mesh>" : "return <Bvh><mesh><sphereGeometry args={[1.6, 256, 128]} /><meshBasicMaterial color='indigo' /></mesh></Bvh>"}\n}\n\n// Render the model.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Model /></Canvas></div> }`
  return <LessonLayout lessonKey={hook ? 'useBvhLesson' : 'bvhLesson'} Demo={BvhDemo} Panel={BvhPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/bvh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Bvh.tsx' />
}
