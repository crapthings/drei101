import { useParams } from 'react-router'
import CameraControlDemo, { CameraControlPanel, useCameraControlStore } from '@/scenes/camera-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// The wrapper example performs a native smooth transition through a React ref.
const wrapperCode = `import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'

// Request a front view through the same instance used for mouse navigation.
export default function Example () {
  const controls = useRef(null)
  return (
    <div>
      <button onClick={() => controls.current?.setLookAt(0, 2, 10, 0, 1, 0, true)}>Front</button>
      <div className='h-[400px]'>
        <Canvas camera={{ position: [7, 4, 9] }}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshBasicMaterial color='#6366f1' />
          </mesh>
          <CameraControls ref={controls} makeDefault smoothTime={0.5} />
        </Canvas>
      </div>
    </div>
  )
}`

// Manual integration makes installation, frame updates and disposal explicit.
const manualCode = `import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControlsImpl } from '@react-three/drei'
import * as THREE from 'three'

// Own the native class lifecycle instead of mounting the wrapper.
function Controls () {
  const ref = useRef(null)
  const camera = useThree((state) => state.camera)
  const canvas = useThree((state) => state.gl.domElement)
  useEffect(() => {
    CameraControlsImpl.install({ THREE })
    const controls = new CameraControlsImpl(camera, canvas)
    controls.smoothTime = 0.5
    void controls.setLookAt(0, 2, 10, 0, 1, 0, true)
    ref.current = controls
    return () => {
      controls.dispose()
      ref.current = null
    }
  }, [camera, canvas])
  useFrame((_, delta) => ref.current?.update(delta), -1)
  return null
}

// Show the same box with a manually updated camera controller.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [7, 4, 9] }}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <Controls />
      </Canvas>
    </div>
  )
}`

// Each integration path has distinct code while sharing native commands and observable camera feedback.
export default function CameraControlLesson () {
  const { name } = useParams()
  const manual = name === 'CameraControlsImpl'
  const settings = useCameraControlStore((state) => state.settings[name])
  const latest = useCameraControlStore((state) => state.commands[name])
  const method = latest?.type === 'fit'
    ? `controls.fitToBox(model, ${settings.smooth}, {
  paddingLeft: 0.5, paddingRight: 0.5,
  paddingTop: 0.5, paddingBottom: 0.5
})`
    : `controls.setLookAt(${latest?.type === 'front' ? '0, 2, 10' : latest?.type === 'side' ? '10, 2, 0' : '7, 4, 9'}, 0, 1, 0, ${settings.smooth})`
  const liveCode = manual
    ? `CameraControlsImpl.install({ THREE })
const controls = new CameraControlsImpl(camera, canvas)
controls.smoothTime = ${settings.smoothTime}
controls.minDistance = 3
controls.maxDistance = ${settings.maxDistance}
${method}
// Frame loop: controls.update(delta)
// Route exit: controls.dispose()`
    : `<CameraControls
  ref={controlsRef}
  makeDefault
  smoothTime={${settings.smoothTime}}
  minDistance={3}
  maxDistance={${settings.maxDistance}}
/>
// const controls = controlsRef.current
${method}`
  return <LessonLayout lessonKey={manual ? 'cameraImplLesson' : 'cameraControlLesson'} Demo={CameraControlDemo} Panel={CameraControlPanel} minimalCode={manual ? manualCode : wrapperCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/camera-controls' referenceUrl='https://github.com/yomotsu/camera-controls#readme' />
}
