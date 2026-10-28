import { useParams } from 'react-router'
import FbxDemo, { FbxPanel, useFbxStore } from '@/scenes/fbx-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains FBX loading with the component or the underlying hook.
export default function FbxLesson () {
  const { name } = useParams()
  const { rotation, scale } = useFbxStore()
  const code = name === 'Fbx' ? `<Fbx path='/models/gem.fbx' rotation-y={${rotation}} scale={${scale}} />` : `const object = useFBX('/models/gem.fbx')\nreturn <group rotation-y={${rotation}} scale={${scale}}><primitive object={object} /></group>`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Load the local FBX and place it in the scene.\nfunction Model () {\n  ${name === 'Fbx' ? 'return ' : ''}${code.replaceAll('\n', '\n  ')}\n}\n\n// Wait for the model and light its faceted surfaces.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><directionalLight position={[3, 5, 6]} intensity={3} /><Suspense fallback={null}><Model /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={FbxDemo} Panel={FbxPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/loaders/fbx-use-fbx' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Fbx.tsx' />
}
