import { useParams } from 'react-router'
import ImageDemo, { ImagePanel, useImageStore } from '@/scenes/image-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// Each lesson demonstrates the image component or the aspect-fitting hook.
export default function ImageLesson () {
  const { name } = useParams()
  const { width, height, zoom, grayscale, radius, factor } = useImageStore()
  const isAspect = name === 'useAspect'
  const example = isAspect
    ? `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { Image, useAspect } from '@react-three/drei'\n\n// Fit a 960 × 540 image to cover the current viewport.\nfunction Picture () {\n  const scale = useAspect(960, 540, 1)\n  return <Image url='/images/crop-demo.svg' scale={[scale[0], scale[1]]} />\n}\n\n// Render inside a canvas so the hook can read its viewport.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <Suspense fallback={null}><Picture /></Suspense>\n  </Canvas></div>\n}`
    : `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { Image } from '@react-three/drei'\n\n// Render a local image in a three-by-two-meter frame.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <Suspense fallback={null}><Image url='/images/crop-demo.svg' scale={[3, 2]} /></Suspense>\n  </Canvas></div>\n}`
  const liveCode = isAspect
    ? `const scale = useAspect(960, 540, ${factor.toFixed(2)})\n<Image url={imageUrl} scale={[scale[0], scale[1]]} />`
    : `<Image url={imageUrl} scale={[${width.toFixed(2)}, ${height.toFixed(2)}]}\n  zoom={${zoom.toFixed(2)}} grayscale={${grayscale.toFixed(2)}} radius={${radius.toFixed(2)}} transparent />`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={ImageDemo} Panel={ImagePanel} minimalCode={example} liveCode={liveCode} docs={isAspect ? 'https://drei.docs.pmnd.rs/misc/use-aspect' : 'https://drei.docs.pmnd.rs/abstractions/image'} referenceUrl={isAspect ? 'https://github.com/pmndrs/drei/blob/master/src/core/useAspect.tsx' : 'https://github.com/pmndrs/drei/blob/master/src/core/Image.tsx'} />
}
