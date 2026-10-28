import { useParams } from 'react-router'
import MatcapDemo, { MatcapPanel, useMatcapStore } from '@/scenes/matcap-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson shows both the hook and its render-prop wrapper.
export default function MatcapLesson () {
  const { name } = useParams()
  const id = useMatcapStore((state) => state.id)
  const code = name === 'MatcapTexture' ? `<MatcapTexture id={${id}} format={256}>{([texture]) => <meshMatcapMaterial matcap={texture} />}</MatcapTexture>` : `const [texture, url, count] = useMatcapTexture(${id}, 256)\nreturn <meshMatcapMaterial matcap={texture} />`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { useMatcapTexture } from '@react-three/drei'\n\n// Apply the selected catalog texture to a matcap material.\nfunction Model () {\n  const [texture] = useMatcapTexture(0, 256)\n  return <mesh><torusKnotGeometry /><meshMatcapMaterial matcap={texture} /></mesh>\n}\n\n// Wait for the catalog and texture before displaying the model.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Suspense fallback={null}><Model /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey='matcapLesson' Demo={MatcapDemo} Panel={MatcapPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/staging/matcap-texture-use-matcap-texture' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/MatcapTexture.tsx' />
}
