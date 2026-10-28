import RefractionDemo, { RefractionPanel, useRefractionStore } from '@/scenes/refraction-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains environment-map refraction and the material's ray tracing settings.
export default function RefractionLesson () {
  const { enabled, ior, bounces, aberration } = useRefractionStore()
  const code = `<MeshRefractionMaterial envMap={envMap} ior={${ior}} bounces={${bounces}} aberrationStrength={${aberration}} fastChroma />`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { MeshRefractionMaterial, useCubeTexture } from '@react-three/drei'\n\n// Load six local environment faces and apply a refractive material.\nfunction Gem () {\n  const envMap = useCubeTexture(['px.svg', 'nx.svg', 'py.svg', 'ny.svg', 'pz.svg', 'nz.svg'], { path: '/images/environment/' })\n  return <mesh rotation={[0.25, 0.35, 0]}><icosahedronGeometry args={[1.2, 1]} />${code}</mesh>\n}\n\n// Wait for the environment before rendering the gem.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}><Suspense fallback={null}><Gem /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey='meshRefractionMaterialLesson' Demo={RefractionDemo} Panel={RefractionPanel} minimalCode={example} liveCode={enabled ? code : '// Refraction material disabled'} docs='https://drei.docs.pmnd.rs/shaders/mesh-refraction-material' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/MeshRefractionMaterial.tsx' />
}
