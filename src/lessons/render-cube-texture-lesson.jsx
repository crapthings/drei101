import RenderCubeTextureDemo, { RenderCubeTexturePanel, useCubeTextureStore } from '@/scenes/render-cube-texture-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains capturing a separate scene into a live cube environment map.
export default function RenderCubeTextureLesson () {
  const { x, resolution } = useCubeTextureStore()
  const code = `<meshStandardMaterial metalness={1} roughness={0.08}>\n  <RenderCubeTexture attach='envMap' resolution={${resolution}}>\n    <color attach='background' args={['#818cf8']} />\n    <mesh position={[${x}, 1, 3]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshBasicMaterial color='#f59e0b' /></mesh>\n    <mesh position={[-3, -1, 1]}><sphereGeometry args={[1, 32, 24]} /><meshBasicMaterial color='#e0e7ff' /></mesh>\n    <mesh position={[3, 0, -2]}><boxGeometry args={[1.5, 3, 1.5]} /><meshBasicMaterial color='#312e81' /></mesh>\n  </RenderCubeTexture>\n</meshStandardMaterial>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { RenderCubeTexture } from '@react-three/drei'\n\n// Capture a child scene and reflect it on a metal sphere.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}>\n    <mesh><sphereGeometry args={[1.3, 64, 48]} /><meshStandardMaterial metalness={1} roughness={0.08}>\n      <RenderCubeTexture attach='envMap' resolution={256}>\n        <color attach='background' args={['#818cf8']} />\n        <mesh position={[0, 1, 3]}><boxGeometry /><meshBasicMaterial color='orange' /></mesh>\n      </RenderCubeTexture>\n    </meshStandardMaterial></mesh>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='renderCubeLesson' Demo={RenderCubeTextureDemo} Panel={RenderCubeTexturePanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/portals/render-cube-texture' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/RenderCubeTexture.tsx' />
}
