import { useParams } from 'react-router'
import AccumulationDemo, { AccumulationPanel, useAccumulationStore } from '@/scenes/accumulative-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson focuses on the accumulator, its randomized lights or its shared context.
export default function AccumulationLesson () {
  const { name } = useParams()
  const radius = useAccumulationStore((state) => state.radius)
  const amount = useAccumulationStore((state) => state.amount)
  const frames = useAccumulationStore((state) => state.frames)
  const x = useAccumulationStore((state) => state.x)
  const code = `<AccumulativeShadows temporal frames={${frames}} scale={7} alphaTest={0.9}>\n  <RandomizedLight amount={${amount}} radius={${radius}} position={[3, 6, 4]} intensity={2} ambient={0} />\n  ${name === 'accumulativeContext' ? '<Observer />' : ''}\n</AccumulativeShadows>`
  const example = `import { useContext, useEffect } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { AccumulativeShadows, RandomizedLight, accumulativeContext } from '@react-three/drei'\n\n// Access the accumulator inside its provider.\nfunction Observer () {\n  const api = useContext(accumulativeContext)\n  useEffect(() => { api.reset() }, [api])\n  return null\n}\n\n// Combine a shadow-casting object with randomized lights and an accumulator.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas shadows camera={{ position: [5, 4, 8], fov: 45 }}>\n    <color attach='background' args={['#e0e7ff']} />\n    <directionalLight position={[4, 6, 5]} intensity={3} />\n    <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='white' /></mesh>\n    <mesh castShadow position={[${x}, 1, 0]}><boxGeometry args={[1.2, 2, 1.2]} /><meshStandardMaterial color='indigo' /></mesh>\n    <AccumulativeShadows temporal frames={${frames}} scale={7} alphaTest={0.9}>\n      <RandomizedLight position={[3, 6, 4]} radius={${radius}} amount={${amount}} intensity={2} ambient={0} /><Observer />\n    </AccumulativeShadows>\n  </Canvas></div>\n}`
  const slug = name === 'RandomizedLight' ? 'staging/randomized-light' : 'staging/accumulative-shadows'
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={AccumulationDemo} Panel={AccumulationPanel} minimalCode={example} liveCode={code} docs={`https://drei.docs.pmnd.rs/${slug}`} referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/AccumulativeShadows.tsx' />
}
