import { useParams } from 'react-router'
import InstancesDemo, { InstancesPanel, useInstancesStore } from '@/scenes/instances-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson focuses on the batch, individual instance or underlying PositionMesh.
export default function InstancesLesson () {
  const { name } = useParams()
  const { count, instanced } = useInstancesStore()
  const code = instanced ? `<Instances limit={100} range={${count}}>\n  <boxGeometry args={[0.35, 0.35, 0.35]} /><meshStandardMaterial />\n  <Instance ref={instanceRef} position={[0, 0, 0]} color='#6366f1' />\n  {/* ${count} instances in total */}\n</Instances>\n// instanceRef.current instanceof PositionMesh` : `// ${count} individually rendered meshes`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Instance, Instances } from '@react-three/drei'\n\n// Draw multiple boxes with one instanced mesh.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    <Instances limit={2}><boxGeometry /><meshStandardMaterial />\n      <Instance position={[-1, 0, 0]} color='indigo' /><Instance position={[1, 0, 0]} color='orange' />\n    </Instances>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={InstancesDemo} Panel={InstancesPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/instances' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Instances.tsx' />
}
