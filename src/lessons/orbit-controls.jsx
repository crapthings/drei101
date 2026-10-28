import { useParams } from 'react-router'
import OrbitDemo, { OrbitPanel, useOrbitDemoStore } from '@/scenes/orbit-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// A complete minimal scene uses the selected control's native mouse and touch mappings.
function createMinimalCode (name) {
  return `import { Canvas } from '@react-three/fiber'
import { ${name} } from '@react-three/drei'

// Inspect a one-meter cube using ${name}.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [8, 9, 10], fov: 50 }}>
        <gridHelper args={[30, 30]} />
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <${name}
          makeDefault
          minDistance={4}
          maxDistance={30}
          maxPolarAngle={85 * Math.PI / 180}
        />
      </Canvas>
    </div>
  )
}`
}

// Separate lessons preserve the same geometry while documenting the two interaction models.
export default function OrbitLesson () {
  const { name } = useParams()
  const settings = useOrbitDemoStore((state) => state.settings[name])
  const liveCode = `<${name}
  makeDefault
  enablePan={${settings.enablePan}}
  enableRotate={${settings.enableRotate}}
  enableZoom={${settings.enableZoom}}
  enableDamping={${settings.enableDamping}}
  dampingFactor={${settings.dampingFactor}}
  screenSpacePanning={${settings.screenSpacePanning}}
  minDistance={4}
  maxDistance={${settings.maxDistance}}
  minPolarAngle={0.1}
  maxPolarAngle={${settings.maxPolar} * Math.PI / 180}
/>`
  return <LessonLayout lessonKey={name === 'MapControls' ? 'mapLesson' : 'orbitLesson'} Demo={OrbitDemo} Panel={OrbitPanel} minimalCode={createMinimalCode(name)} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/introduction' cameraType={name} />
}
