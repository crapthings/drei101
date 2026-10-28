import CatmullDemo, { CatmullPanel, useCatmullStore } from '@/scenes/catmull-rom'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example draws a smooth curve through four given points.
const example = `import { Canvas } from '@react-three/fiber'
import { CatmullRomLine } from '@react-three/drei'

// Render a smooth line through four points.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}>
    <CatmullRomLine points={[[-3, -1, 0], [-1, 2, 0], [1, -1.5, 0], [3, 1, 0]]}
      segments={48} color='#4f46e5' lineWidth={4} />
  </Canvas></div>
}`

// The lesson shows the current interpolation and waypoint settings as code.
export default function CatmullLesson () {
  const { y, closed, curveType, tension, segments } = useCatmullStore()
  const liveCode = `<CatmullRomLine\n  points={[[-3, -1, 0], [-1, ${y.toFixed(1)}, 0], [1, -1.5, 0], [3, 1, 0]]}\n  closed={${closed}} curveType='${curveType}' tension={${tension.toFixed(2)}}\n  segments={${segments}} color='#4f46e5' lineWidth={4}\n/>`
  return <LessonLayout lessonKey='catmullRomLineLesson' Demo={CatmullDemo} Panel={CatmullPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/catmull-rom-line' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/CatmullRomLine.tsx' />
}
