import FlightDemo, { FlightPanel, useFlyStore } from '@/scenes/fly-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// The minimal example demonstrates the library defaults before adding page-specific focus scoping.
const minimalCode = `import { Canvas } from '@react-three/fiber'
import { FlyControls } from '@react-three/drei'

// Fly through a minimal scene using keyboard and mouse.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <gridHelper args={[40, 40]} />
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <FlyControls makeDefault movementSpeed={3} rollSpeed={0.5} dragToLook />
      </Canvas>
    </div>
  )
}`

// Current movement settings remain visible without resubscribing the lesson to position telemetry.
export default function FlightLesson () {
  const movementSpeed = useFlyStore((state) => state.movementSpeed)
  const rollSpeed = useFlyStore((state) => state.rollSpeed)
  const active = useFlyStore((state) => state.active)
  const liveCode = active
    ? `<FlyControls
  makeDefault
  movementSpeed={${movementSpeed}}
  rollSpeed={${rollSpeed}}
  dragToLook
/>`
    : '// Paused: FlyControls is unmounted; the camera keeps its position.'
  return <LessonLayout lessonKey='flightLesson' Demo={FlightDemo} Panel={FlightPanel} minimalCode={minimalCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/introduction' cameraType='FlyControls' />
}
