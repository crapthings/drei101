import PortalMaterialDemo, { PortalMaterialPanel, usePortalStore } from '@/scenes/portal-material-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains displaying and blending a separate scene through a mesh.
export default function PortalMaterialLesson () {
  const { blend, x } = usePortalStore()
  const code = `<mesh>\n  <circleGeometry args={[1.5, 64]} />\n  <MeshPortalMaterial blend={${blend}}>\n    <PortalWorld />\n  </MeshPortalMaterial>\n</mesh>\n\nfunction PortalWorld () {\n  const mesh = useRef(null)\n  useFrame((state, delta) => { if (mesh.current) mesh.current.rotation.y += delta * 0.5 })\n  return <>\n    <color attach='background' args={['#312e81']} />\n    <directionalLight position={[2, 4, 4]} intensity={3} />\n    <mesh ref={mesh} position={[${x}, 0, -1]}><torusKnotGeometry args={[0.7, 0.23, 128, 24]} /><meshStandardMaterial color='#fbbf24' /></mesh>\n    <gridHelper args={[8, 8, '#818cf8', '#4f46e5']} position={[0, -1.2, -1]} />\n  </>\n}`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { MeshPortalMaterial } from '@react-three/drei'\n\n// Render a separate scene through a circular portal.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <mesh><circleGeometry args={[1.5, 64]} /><MeshPortalMaterial>\n      <color attach='background' args={['#312e81']} />\n      <mesh position={[0, 0, -1]}><boxGeometry /><meshNormalMaterial /></mesh>\n    </MeshPortalMaterial></mesh>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='portalLesson' Demo={PortalMaterialDemo} Panel={PortalMaterialPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/portals/mesh-portal-material' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/MeshPortalMaterial.tsx' />
}
