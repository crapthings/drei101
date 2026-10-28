import { useParams } from 'react-router'
import TextureLoadDemo, { TextureLoadPanel, useTextureLoadStore } from '@/scenes/texture-load-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains loading a texture with either a hook or a render-function component.
export default function TextureLoadLesson () {
  const { name } = useParams()
  const { image } = useTextureLoadStore()
  const path = `/images/${image === 'vector' ? 'vector-demo.svg' : 'crop-demo.svg'}`
  const hook = name === 'useTexture'
  const code = hook ? `const texture = useTexture('${path}')\nreturn <mesh><planeGeometry args={[4, 2.4]} /><meshBasicMaterial map={texture} /></mesh>` : `return <Texture input='${path}'>{texture => <mesh><planeGeometry args={[4, 2.4]} /><meshBasicMaterial map={texture} /></mesh>}</Texture>`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Load a local image and attach it as a material map.\nfunction Picture () {\n  ${code.replaceAll('\n', '\n  ')}\n}\n\n// The suspense boundary waits for the texture.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Suspense fallback={null}><Picture /></Suspense></Canvas></div>\n}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={TextureLoadDemo} Panel={TextureLoadPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/loaders/texture-use-texture' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Texture.tsx' />
}
