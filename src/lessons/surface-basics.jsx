import { useParams } from 'react-router'
import SurfaceBasicsDemo, { SurfaceBasicsPanel, useSurfaceBasicsStore } from '@/scenes/surface-basics'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson shows the selected edge, outline or animated material with live settings.
export default function SurfaceBasicsLesson () {
  const { name } = useParams()
  const { enabled, amount, speed, thickness, threshold, width } = useSurfaceBasicsStore()
  const elements = {
    Edges: `<Edges threshold={${threshold}} lineWidth={${width}} color='#312e81' />`,
    Outlines: `<Outlines screenspace thickness={${thickness}} color='#312e81' />`,
    MeshDistortMaterial: `<MeshDistortMaterial color='#6366f1' distort={${amount}} speed={${speed}} />`,
    MeshWobbleMaterial: `<MeshWobbleMaterial color='#6366f1' factor={${amount}} speed={${speed}} />`
  }
  const motion = name.startsWith('Mesh')
  const object = motion ? `<mesh>${name === 'MeshWobbleMaterial' ? '<boxGeometry args={[1.6, 1.6, 1.6, 24, 24, 24]} />' : '<sphereGeometry args={[1, 64, 48]} />'}${elements[name]}</mesh>` : `<mesh rotation={[0.3, 0.45, 0]}><icosahedronGeometry args={[1.1, 1]} /><meshStandardMaterial color='#6366f1' />${elements[name]}</mesh>`
  const minimal = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Render a mesh with the selected surface effect.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <directionalLight position={[3, 5, 6]} intensity={3} />\n    ${object}\n  </Canvas></div>\n}`
  const slug = motion ? `shaders/${name === 'MeshDistortMaterial' ? 'mesh-distort-material' : 'mesh-wobble-material'}` : `abstractions/${name.toLowerCase()}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={SurfaceBasicsDemo} Panel={SurfaceBasicsPanel} minimalCode={minimal} liveCode={enabled ? elements[name] : '// Effect disabled'} docs={`https://drei.docs.pmnd.rs/${slug}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`} />
}
