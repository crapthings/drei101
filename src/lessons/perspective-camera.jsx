import PerspectiveDemo from '@/scenes/perspective-camera'
import { CameraPanel } from '@/camera-panel'
import { useDemoStore } from '@/store'
import { LessonLayout } from '@/lessons/lesson-layout'

// A complete minimal scene demonstrates camera activation without lighting dependencies.
const minimalCode = `import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'

// Render a cube through a declarative perspective camera.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
      </Canvas>
    </div>
  )
}`

// Perspective-specific state and source examples populate the common learning layout.
export default function PerspectiveLesson () {
  const { fov, distance, near, far } = useDemoStore()
  const liveCode = `<PerspectiveCamera
  makeDefault
  position={[0, 2, ${distance}]}
  fov={${fov}}
  near={${near}}
  far={${far}}
/>`

  return <LessonLayout lessonKey='perspectiveLesson' Demo={PerspectiveDemo} Panel={CameraPanel} minimalCode={minimalCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/cameras/perspective-camera' cameraType='PerspectiveCamera' />
}
