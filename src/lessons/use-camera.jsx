import PickingDemo, { PickingPanel, usePickingStore } from '@/scenes/use-camera'
import { LessonLayout } from '@/lessons/lesson-layout'

// A non-default render camera demonstrates the hook without replacing the R3F event camera.
const minimalCode = `import { useLayoutEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCamera } from '@react-three/drei'
import { OrthographicCamera } from 'three'

// Render and raycast with one stable custom camera.
function Scene () {
  const camera = useMemo(() => new OrthographicCamera(-4, 4, 3, -3, 0.1, 40), [])
  const raycast = useCamera(camera)
  useLayoutEffect(() => {
    camera.position.set(1.5, 0, 8)
    camera.updateMatrixWorld()
  }, [camera])
  useFrame(({ gl, scene, camera: defaultCamera }) => {
    defaultCamera.updateMatrixWorld()
    gl.render(scene, camera)
  }, 1)
  return (
    <mesh position={[1.5, 0, 0]} raycast={raycast} onClick={() => console.log('C')}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color='#818cf8' />
    </mesh>
  )
}

// The default camera intentionally differs from the camera drawing Scene.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <Scene />
      </Canvas>
    </div>
  )
}`

// The live snippet changes only the selected raycast implementation, matching the fixed-image experiment.
export default function PickingLesson () {
  const correct = usePickingStore((state) => state.correct)
  const liveCode = `const raycast = useCamera(customCamera)

<mesh
  position={[1.5, 0, 0]}
  raycast={${correct ? 'raycast' : 'Mesh.prototype.raycast'}}
  onClick={() => hit('C')}
>
  <planeGeometry args={[1, 1]} />
  <meshBasicMaterial color='#818cf8' />
</mesh>`
  return <LessonLayout lessonKey='pickingLesson' Demo={PickingDemo} Panel={PickingPanel} minimalCode={minimalCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/misc/use-camera' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/useCamera.tsx' />
}
