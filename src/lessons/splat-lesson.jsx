import SplatDemo, { SplatPanel, useSplatStore } from '@/scenes/splat-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains loading and displaying a Gaussian splat asset.
export default function SplatLesson () {
  const { alphaTest, alphaHash } = useSplatStore()
  const code = `<Splat src='/models/synthetic-orbit.splat' alphaTest={${alphaTest}} alphaHash={${alphaHash}} />`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { OrbitControls, Splat } from '@react-three/drei'\n\n// Load a local .splat file and inspect it from different angles.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <Suspense fallback={null}>${code}</Suspense>\n    <OrbitControls />\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='splatLesson' Demo={SplatDemo} Panel={SplatPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/loaders/splat' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Splat.tsx' />
}
