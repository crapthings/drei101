import CausticsDemo, { CausticsPanel, useCausticsStore } from '@/scenes/caustics-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson demonstrates Drei's refracted-light projection on a receiver plane.
export default function CausticsLesson () {
  const { ior, intensity, radius, lightX, height } = useCausticsStore()
  const code = `<Caustics frames={1} resolution={512} ior={${ior}} intensity={${intensity}} worldRadius={${radius}} lightSource={[${lightX}, 5, 3]}>\n  <mesh position={[0, ${height}, 0]}><sphereGeometry args={[0.8, 48, 32]} /><meshPhysicalMaterial color='#a5b4fc' transparent opacity={0.6} /></mesh>\n</Caustics>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Caustics } from '@react-three/drei'\n\n// Project refracted light from a sphere onto the Y-up receiver.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [5, 4, 8] }}>\n    <directionalLight position={[3, 5, 4]} intensity={3} />\n    <mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='#334155' /></mesh>\n    ${code}\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='causticsLesson' Demo={CausticsDemo} Panel={CausticsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/staging/caustics' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Caustics.tsx' />
}
