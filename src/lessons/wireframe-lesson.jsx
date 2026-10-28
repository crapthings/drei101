import WireframeDemo, { WireframePanel, useWireframeStore } from '@/scenes/wireframe-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson demonstrates Drei's barycentric wireframe overlay on a mesh.
export default function WireframeLesson () {
  const { enabled, dash, thickness, repeats } = useWireframeStore()
  const code = `<Wireframe stroke='#fbbf24' thickness={${thickness}} dash={${dash}} dashRepeats={${repeats}} fillOpacity={0} />`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Wireframe } from '@react-three/drei'\n\n// Overlay a shader wireframe on the parent mesh.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n  <directionalLight position={[3, 5, 6]} intensity={3} />\n  <mesh rotation={[0.3, 0.45, 0]}><icosahedronGeometry args={[1.2, 1]} /><meshStandardMaterial color='#818cf8' />${code}</mesh>\n</Canvas></div> }`
  const source = 'https://github.com/pmndrs/drei/blob/master/src/core/Wireframe.tsx'
  return <LessonLayout lessonKey='wireframeLesson' Demo={WireframeDemo} Panel={WireframePanel} minimalCode={example} liveCode={enabled ? code : '// Wireframe disabled'} docs={source} referenceUrl={source} />
}
