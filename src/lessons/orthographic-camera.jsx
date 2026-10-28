import OrthographicDemo, { OrthographicPanel, useOrthoStore } from '@/scenes/orthographic-camera'
import { LessonLayout } from '@/lessons/lesson-layout'

// A complete example activates an orthographic camera with canvas-sized default bounds.
const minimalCode = `import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'

// Show a one-meter cube through an orthographic camera.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 8]} zoom={65} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
      </Canvas>
    </div>
  )
}`

// Orthographic-specific content and live camera values populate the common chapter layout.
export default function OrthographicLesson () {
  const { zoom, distance, near, far, perspective } = useOrthoStore()
  const liveCode = `<${perspective ? 'PerspectiveCamera' : 'OrthographicCamera'}
  makeDefault
  position={[0, 0, ${distance}]}
  ${perspective ? 'fov={50}' : `zoom={${zoom}}`}
  near={${perspective ? Math.max(0.01, near) : near}}
  far={${far}}
/>`
  return <LessonLayout lessonKey='orthographicLesson' Demo={OrthographicDemo} Panel={OrthographicPanel} minimalCode={minimalCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/cameras/orthographic-camera' cameraType='OrthographicCamera' />
}
