import { useParams } from 'react-router'
import GradientDemo, { GradientPanel, useGradientStore } from '@/scenes/gradient-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains gradient texture generation and its exported type values.
export default function GradientLesson () {
  const { name } = useParams()
  const { type, middle } = useGradientStore()
  const code = `<GradientTexture type={GradientType.${type === 'linear' ? 'Linear' : 'Radial'}} stops={[0, ${middle}, 1]} colors={['#4f46e5', '#a5b4fc', '#fbbf24']} width={512} size={512} />`
  const minimal = `import { Canvas } from '@react-three/fiber'\nimport { GradientTexture, GradientType } from '@react-three/drei'\n\n// Attach a generated gradient to a material's map.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <mesh><planeGeometry args={[3.5, 3.5]} /><meshBasicMaterial>${code}</meshBasicMaterial></mesh>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={GradientDemo} Panel={GradientPanel} minimalCode={minimal} liveCode={code} docs='https://drei.docs.pmnd.rs/abstractions/gradient-texture' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/GradientTexture.tsx' />
}
