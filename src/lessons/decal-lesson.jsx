import DecalDemo, { DecalPanel, useDecalStore } from '@/scenes/decal-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains projection volumes and the surface geometry used by Decal.
export default function DecalLesson () {
  const { x, size, debug, enabled } = useDecalStore()
  const code = `<Decal map={texture} position={[${x}, 0, 1.25]} scale={[${size}, ${(size * 0.6).toFixed(2)}, 1]} debug={${debug}} />`
  const minimal = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { Decal, useTexture } from '@react-three/drei'\n\n// Project a local image onto a curved sphere.\nfunction Model () {\n  const texture = useTexture('/images/vector-demo.svg')\n  return <mesh><sphereGeometry args={[1.35, 64, 48]} /><meshStandardMaterial color='#818cf8' />${code}</mesh>\n}\n\n// Render the model after the image loads.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><directionalLight position={[3, 5, 6]} intensity={3} /><Suspense fallback={null}><Model /></Suspense></Canvas></div>\n}`
  return <LessonLayout lessonKey='decalLesson' Demo={DecalDemo} Panel={DecalPanel} minimalCode={minimal} liveCode={enabled ? code : '// Decal disabled'} docs='https://drei.docs.pmnd.rs/abstractions/decal' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Decal.tsx' />
}
