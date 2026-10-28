import { useParams } from 'react-router'
import CubeDemo, { CubeHookDemo, CapturePanel, useCaptureStore } from '@/scenes/cube-camera'
import { LessonLayout } from '@/lessons/lesson-layout'

// A complete component example reflects the local scene while excluding the sphere itself.
const componentCode = `import { Canvas } from '@react-three/fiber'
import { CubeCamera } from '@react-three/drei'

// Capture a colored marker in a reflective sphere.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach='background' args={['#eef2ff']} />
        <mesh position={[2, 0, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <CubeCamera resolution={128}>
          {(texture) => (
            <mesh>
              <sphereGeometry args={[1, 32, 24]} />
              <meshStandardMaterial envMap={texture} metalness={1} roughness={0.05} />
            </mesh>
          )}
        </CubeCamera>
      </Canvas>
    </div>
  )
}`

// The imperative example explicitly hides the reflector around each six-view capture.
const hookCode = `import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCubeCamera } from '@react-three/drei'

// Keep the reflective sphere outside its own captured image.
function Reflector () {
  const sphere = useRef(null)
  const { fbo, update } = useCubeCamera({ resolution: 128 })
  useFrame(() => {
    sphere.current.visible = false
    try {
      update()
    } finally {
      sphere.current.visible = true
    }
  })
  return (
    <mesh ref={sphere}>
      <sphereGeometry args={[1, 32, 24]} />
      <meshStandardMaterial envMap={fbo.texture} metalness={1} roughness={0.05} />
    </mesh>
  )
}

// Render a standalone capture scene with one colored marker.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach='background' args={['#eef2ff']} />
        <mesh position={[2, 0, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <Reflector />
      </Canvas>
    </div>
  )
}`

// Component and hook lessons share capture experiments while explaining their distinct APIs.
export default function CubeLesson () {
  const { name } = useParams()
  const hook = name === 'useCubeCamera'
  const { live, roughness, resolution, capture } = useCaptureStore()
  const liveCode = hook
    ? `const { fbo, camera, update } = useCubeCamera({
  resolution: ${resolution}, near: 0.1, far: 40
})
camera.position.set(0, 1, 0)
// live = ${live}; snapshot request = ${capture}
// Call update() with the reflector hidden when a capture is needed.
<meshStandardMaterial envMap={fbo.texture} metalness={1} roughness={${roughness}} />`
    : `<CubeCamera
  key='${live}-${capture}-${resolution}'
  position={[0, 1, 0]}
  resolution={${resolution}}
  near={0.1}
  far={40}
  frames={${live ? 'Infinity' : 1}}
>
  {(texture) => (
    <mesh>
      <sphereGeometry args={[1, 48, 32]} />
      <meshStandardMaterial envMap={texture} metalness={1} roughness={${roughness}} />
    </mesh>
  )}
</CubeCamera>`
  return <LessonLayout lessonKey={hook ? 'cubeHookLesson' : 'cubeLesson'} Demo={hook ? CubeHookDemo : CubeDemo} Panel={CapturePanel} minimalCode={hook ? hookCode : componentCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/cameras/cube-camera' cameraType='CubeCamera' />
}
