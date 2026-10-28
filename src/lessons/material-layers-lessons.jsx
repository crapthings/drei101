import { useParams } from 'react-router'
import MaterialLayersDemo, { MaterialLayersPanel, useMaterialLayersStore } from '@/scenes/material-layers-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains invisible shadow casters or multiple material passes on one mesh.
export default function MaterialLayersLesson () {
  const { name } = useParams()
  const { enabled, opacity } = useMaterialLayersStore()
  const discard = name === 'MeshDiscardMaterial'
  const effect = discard ? '<MeshDiscardMaterial />' : `<MultiMaterial><meshStandardMaterial color='#818cf8' /><meshBasicMaterial color='#fbbf24' wireframe transparent opacity={${opacity}} /></MultiMaterial>`
  const mesh = discard ? `<mesh castShadow position={[0, 1.2, 0]}><boxGeometry args={[1.3, 1.3, 1.3]} />${effect}<Edges color='#312e81' /></mesh>` : `<mesh><icosahedronGeometry args={[1.2, 1]} />${effect}</mesh>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${discard ? 'Edges, MeshDiscardMaterial' : 'MultiMaterial'} } from '@react-three/drei'\n\n// Draw the selected material effect on a mesh.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas shadows camera={{ position: [5, 5, 10], fov: 45 }}>\n    <directionalLight castShadow position={[3, 7, 5]} intensity={3} />\n    ${discard ? "<mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[10, 8]} /><meshStandardMaterial color='white' /></mesh>" : ''}\n    ${mesh}\n  </Canvas></div>\n}`
  const slug = discard ? 'shaders/mesh-discard-material' : null
  const source = `https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={MaterialLayersDemo} Panel={MaterialLayersPanel} minimalCode={example} liveCode={enabled ? mesh : '// Effect disabled'} docs={slug ? `https://drei.docs.pmnd.rs/${slug}` : source} referenceUrl={source} />
}
