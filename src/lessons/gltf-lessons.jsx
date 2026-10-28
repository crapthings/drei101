import { useParams } from 'react-router'
import GltfDemo, { GltfPanel, useGltfStore } from '@/scenes/gltf-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains loading and reusing the same local glTF scene.
export default function GltfLesson () {
  const { name } = useParams()
  const { count, rotation } = useGltfStore()
  const imports = name === 'Gltf' ? 'Gltf' : name === 'Clone' ? 'Clone, useGLTF' : 'useGLTF'
  const code = name === 'Gltf' ? "return <Gltf src='/models/robot.gltf' />" : name === 'Clone' ? "const { scene } = useGLTF('/models/robot.gltf')\nreturn <><Clone object={scene} position={[-1, 0, 0]} /><Clone object={scene} position={[1, 0, 0]} /></>" : "const { scene, nodes, materials } = useGLTF('/models/robot.gltf')\nreturn <primitive object={scene} />"
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${imports} } from '@react-three/drei'\n\n// Load and display the local model.\nfunction Model () {\n  ${code.replaceAll('\n', '\n  ')}\n}\n\n// Provide lighting and wait for the glTF asset.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><directionalLight position={[3, 5, 6]} intensity={3} /><Suspense fallback={null}><Model /></Suspense></Canvas></div> }`
  const instances = Array.from({ length: count }, (_, index) => {
    const position = (index - (count - 1) / 2) * 2.2
    const turn = Number((rotation * (index + 1)).toFixed(2))
    return name === 'Gltf' ? `<Gltf src='/models/robot.gltf' position={[${position}, 0, 0]} rotation-y={${turn}} />` : `<group position={[${position}, 0, 0]} rotation-y={${turn}}>${name === 'useGLTF' && index === 0 ? '<primitive object={scene} />' : '<Clone object={scene} />'}</group>`
  }).join('\n')
  const live = `${name === 'Gltf' ? '' : "const { scene } = useGLTF('/models/robot.gltf')\n"}${instances}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={GltfDemo} Panel={GltfPanel} minimalCode={example} liveCode={live} docs={name === 'Clone' ? 'https://drei.docs.pmnd.rs/abstractions/clone' : 'https://drei.docs.pmnd.rs/loaders/gltf-use-gltf'} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name === 'Clone' ? 'Clone' : 'Gltf'}.tsx`} />
}
