import SvgDemo, { SvgPanel, useSvgStore } from '@/scenes/svg-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example loads a local SVG as Three.js fill and stroke meshes.
const example = `import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Svg } from '@react-three/drei'

// Load a 200 × 120 SVG and place its center at the origin.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>
    <Suspense fallback={null}><Svg src='/images/vector-demo.svg' scale={0.015}
      position={[-1.5, 0.9, 0]} /></Suspense>
  </Canvas></div>
}`

// The lesson displays current scale and fill and stroke settings.
export default function SvgLesson () {
  const { scale, fill, stroke } = useSvgStore()
  const liveCode = `<Svg src={svgUrl} scale={${scale.toFixed(3)}}\n  position={[${(-100 * scale).toFixed(2)}, ${(60 * scale).toFixed(2)}, 0]}\n  skipFill={${!fill}} skipStrokes={${!stroke}} />`
  return <LessonLayout lessonKey='svgLesson' Demo={SvgDemo} Panel={SvgPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/abstractions/svg' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Svg.tsx' />
}
