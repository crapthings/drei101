import { useParams } from 'react-router'
import InstanceGroupsDemo, { InstanceGroupsPanel, useInstanceGroupsStore } from '@/scenes/instance-groups-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson compares isolated instance contexts with batches derived from source meshes.
export default function InstanceGroupsLesson () {
  const { name } = useParams()
  const count = useInstanceGroupsStore((state) => state.count)
  const merged = name === 'Merged'
  const code = merged ? `<Merged meshes={{ box: boxMesh, sphere: sphereMesh }} limit={20}>\n  {({ box: Box, sphere: Sphere }) => <>\n    {/* ${count} Box instances and ${count} Sphere instances */}\n  </>}\n</Merged>` : `const [Boxes, Box] = createInstances()\nconst [Spheres, Sphere] = createInstances()\n\n<Boxes limit={20}>{/* ${count} Box instances */}</Boxes>\n<Spheres limit={20}>{/* ${count} Sphere instances */}</Spheres>`
  const example = merged ? `import { Canvas } from '@react-three/fiber'\nimport { Merged } from '@react-three/drei'\nimport { BoxGeometry, SphereGeometry, Mesh, MeshNormalMaterial } from 'three'\n\n// Define source geometries and materials for the two batches.\nconst meshes = { box: new Mesh(new BoxGeometry(), new MeshNormalMaterial()), sphere: new Mesh(new SphereGeometry(), new MeshNormalMaterial()) }\n\n// Create instances from the source meshes.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Merged meshes={meshes}>{({ box: Box, sphere: Sphere }) => <><Box position={[-1, 0, 0]} /><Sphere position={[1, 0, 0]} /></>}</Merged></Canvas></div> }` : `import { Canvas } from '@react-three/fiber'\nimport { createInstances } from '@react-three/drei'\n\n// Create an isolated provider and its matching instance component.\nconst [Boxes, Box] = createInstances()\n\n// Render a batch through the generated pair.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Boxes><boxGeometry /><meshNormalMaterial /><Box position={[-1, 0, 0]} /><Box position={[1, 0, 0]} /></Boxes></Canvas></div> }`
  return <LessonLayout lessonKey={merged ? 'mergedLesson' : 'createInstancesLesson'} Demo={InstanceGroupsDemo} Panel={InstanceGroupsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/instances' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Instances.tsx' />
}
