import { useParams } from 'react-router'
import NormalTextureDemo, { NormalTexturePanel, useNormalLessonStore } from '@/scenes/normal-texture-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the normal texture hook and its render-prop counterpart.
export default function NormalTextureLesson () {
  const { name } = useParams()
  const { id, repeat, strength } = useNormalLessonStore()
  const code = name === 'NormalTexture' ? `<NormalTexture id={${id}} repeat={[${repeat}, ${repeat}]}>{([texture]) => <meshStandardMaterial args={[{ hexTiling: { patchScale: 2 } }]} normalMap={texture} normalScale={[${strength}, ${strength}]} />}</NormalTexture>` : `const [texture, url, count] = useNormalTexture(${id}, { repeat: [${repeat}, ${repeat}] })\nreturn <meshStandardMaterial args={[{ hexTiling: { patchScale: 2 } }]} normalMap={texture} normalScale={[${strength}, ${strength}]} />`
  const example = `import 'three-hex-tiling'\nimport { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { useNormalTexture } from '@react-three/drei'\n\n// Load a normal map and enable hex tiling when the material is created.\nfunction Surface () {\n  const [texture] = useNormalTexture(0, { repeat: [2, 2] })\n  return <mesh><planeGeometry args={[4, 4]} /><meshStandardMaterial args={[{ hexTiling: { patchScale: 2 } }]} normalMap={texture} /></mesh>\n}\n\n// Render the loaded surface under a directional light.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><directionalLight position={[3, 2, 3]} intensity={3} /><Suspense fallback={null}><Surface /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey='normalTextureLesson' Demo={NormalTextureDemo} Panel={NormalTexturePanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/staging/normal-texture-use-normal-texture' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/NormalTexture.tsx' />
}
