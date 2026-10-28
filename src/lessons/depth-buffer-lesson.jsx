import DepthBufferDemo, { DepthBufferPanel, useDepthStore } from '@/scenes/depth-buffer-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains capturing depth and converting it for visualization.
export default function DepthBufferLesson () {
  const z = useDepthStore((state) => state.z)
  const code = `// Use a square camera aspect for the square depth target.\n<PerspectiveCamera makeDefault manual aspect={1} position={[0, 0, 5]} near={0.5} far={10} />\nconst depth = useDepthBuffer({ size: 512, frames: Infinity })\n// Sphere position: [-0.65, 0, ${z}]\n// Sample depth in a shader using the capture camera's near and far planes.`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { useDepthBuffer } from '@react-three/drei'\n\n// Capture a depth texture for use by another effect.\nfunction Scene () {\n  const depth = useDepthBuffer({ size: 512 })\n  return <mesh userData={{ depth }}><boxGeometry /><meshNormalMaterial /></mesh>\n}\n\n// Provide the camera and renderer used for the depth capture.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 5] }}><Scene /></Canvas></div> }`
  return <LessonLayout lessonKey='depthLesson' Demo={DepthBufferDemo} Panel={DepthBufferPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/misc/use-depth-buffer' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/useDepthBuffer.tsx' />
}
