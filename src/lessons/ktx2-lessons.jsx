import { useParams } from 'react-router'
import KtxDemo, { KtxPanel, useKtxLessonStore } from '@/scenes/ktx2-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains loading and transcoding a Basis-compressed KTX2 texture.
export default function KtxLesson () {
  const { name } = useParams()
  const { rotation, scale } = useKtxLessonStore()
  const hook = name === 'useKTX2'
  const plane = `<mesh rotation-z={${rotation}} scale={[${scale}, -${scale}, ${scale}]}><planeGeometry args={[3, 3]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>`
  const code = hook ? `const texture = useKTX2('/textures/ktx2/2d_etc1s.ktx2', '/basis/')\nreturn ${plane}` : `return <Ktx2 input='/textures/ktx2/2d_etc1s.ktx2' basisPath='/basis/'>{texture => ${plane}}</Ktx2>`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Load the compressed KTX2 file with a local Basis transcoder.\nfunction Picture () {\n  ${code.replaceAll('\n', '\n  ')}\n}\n\n// Wait for loading and transcoding before rendering the surface.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><Suspense fallback={null}><Picture /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={KtxDemo} Panel={KtxPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/loaders/ktx2-use-ktx2' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Ktx2.tsx' />
}
