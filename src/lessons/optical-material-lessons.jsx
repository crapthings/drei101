import { useParams } from 'react-router'
import OpticalDemo, { OpticalPanel, useOpticalStore } from '@/scenes/optical-material-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains a reflective floor or a transmissive refractive surface.
export default function OpticalLesson () {
  const { name } = useParams()
  const { enabled, strength, blur, ior, thickness, roughness } = useOpticalStore()
  const reflector = name === 'MeshReflectorMaterial'
  const code = reflector ? `<MeshReflectorMaterial resolution={512} blur={[300, 300]} mixBlur={${blur}} mixStrength={${strength}} color='#a5b4fc' roughness={0.4} />` : `<MeshTransmissionMaterial transmission={1} ior={${ior}} thickness={${thickness}} roughness={${roughness}} chromaticAberration={0.03} samples={6} resolution={512} />`
  const content = reflector ? `<mesh rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} />${code}</mesh><mesh position={[0, 1, 0]}><boxGeometry args={[1, 2, 1]} /><meshStandardMaterial color='#6366f1' /></mesh>` : `<mesh position={[0, 0, -2]}><planeGeometry args={[6, 4]} /><meshBasicMaterial color='#fbbf24' /></mesh><mesh><sphereGeometry args={[1.3, 64, 48]} />${code}</mesh>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Render the optical material and a visible object behind or above it.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: ${reflector ? '[5, 4, 8]' : '[0, 0, 8]'}, fov: 45 }}>\n  <directionalLight position={[3, 5, 6]} intensity={3} />\n  ${content}\n</Canvas></div> }`
  const slug = reflector ? 'mesh-reflector-material' : 'mesh-transmission-material'
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={OpticalDemo} Panel={OpticalPanel} minimalCode={example} liveCode={enabled ? code : '// Optical material disabled'} docs={`https://drei.docs.pmnd.rs/shaders/${slug}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`} />
}
