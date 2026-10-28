import { useParams } from 'react-router'
import CubeTextureDemo, { CubeTexturePanel, useCubeTextureStore } from '@/scenes/cube-texture-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson demonstrates the component or hook that loads six faces as a cube texture.
export default function CubeTextureLesson () {
  const { name } = useParams()
  const { intensity, roughness, enabled } = useCubeTextureStore()
  const hook = name === 'useCubeTexture'
  const sphere = `<mesh><sphereGeometry args={[1.15, 64, 48]} /><meshStandardMaterial metalness={1} roughness={${roughness}} envMap={texture} envMapIntensity={${intensity}} /></mesh>`
  const code = hook ? `const texture = useCubeTexture(files, { path: '/images/environment/' })\nreturn ${sphere}` : `return <CubeTexture files={files} path='/images/environment/'>{texture => ${sphere}}</CubeTexture>`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// The files follow +X, -X, +Y, -Y, +Z, -Z order.\nconst files = ['px.svg', 'nx.svg', 'py.svg', 'ny.svg', 'pz.svg', 'nz.svg']\n\n// Load the cube texture and use it as the metal sphere's environment map.\nfunction Reflection () {\n  ${code.replaceAll('\n', '\n  ')}\n}\n\n// Wait for all six faces before rendering the reflection.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Suspense fallback={null}><Reflection /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={CubeTextureDemo} Panel={CubeTexturePanel} minimalCode={example} liveCode={enabled ? code : '// Environment map disabled'} docs='https://drei.docs.pmnd.rs/loaders/cube-texture-use-cube-texture' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/CubeTexture.tsx' />
}
