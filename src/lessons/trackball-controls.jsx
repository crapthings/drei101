import { useParams } from 'react-router'
import BallDemo, { BallPanel, useBallStore } from '@/scenes/trackball-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// The installed Arcball wrapper needs a narrow native-gizmo bridge to display its helper rings.
const arcCode = `import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ArcballControls } from '@react-three/drei'

// Bridge native helpers for drei 10.7.9 and its installed three-stdlib.
function Controls () {
  const ref = useRef(null)
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    const control = ref.current
    control.scene = scene
    // Version-specific internal field: recheck after upgrades.
    const gizmos = control._gizmos
    scene.add(gizmos)
    return () => scene.remove(gizmos)
  }, [scene])
  return <ArcballControls ref={ref} makeDefault minDistance={3} maxDistance={20} />
}

// Inspect a model using native arcball rotation and focus.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [5, 3, 7] }}>
        <mesh>
          <boxGeometry args={[2, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <Controls />
      </Canvas>
    </div>
  )
}`

// A minimal Trackball scene demonstrates unrestricted camera-up changes around a fixed target.
const trackCode = `import { Canvas } from '@react-three/fiber'
import { TrackballControls } from '@react-three/drei'

// Orbit a fixed model without preserving a constant up vector.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [5, 3, 7] }}>
        <axesHelper args={[3]} />
        <mesh>
          <boxGeometry args={[2, 1, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <TrackballControls makeDefault staticMoving={false} dynamicDampingFactor={0.2} />
      </Canvas>
    </div>
  )
}`

// Distinct chapter content and parameter snippets explain the two free-rotation implementations.
export default function BallLesson () {
  const { name } = useParams()
  const arc = name === 'ArcballControls'
  const state = useBallStore((store) => store.settings[name])
  const liveCode = arc
    ? `<ArcballControls
  ref={controls}
  makeDefault
  enableRotate={${state.rotate}}
  enablePan={${state.pan}}
  enableZoom={${state.zoom}}
  enableAnimations={${state.inertia}}
  dampingFactor={${state.dampingFactor}}
  scaleFactor={${state.scaleFactor}}
  minDistance={3}
  maxDistance={${state.maxDistance}}
/>
// After mounting, on the scene-connected controller:
controls.current.setGizmosVisible(${state.gizmos})`
    : `<TrackballControls
  makeDefault
  noRotate={${!state.rotate}}
  noPan={${!state.pan}}
  noZoom={${!state.zoom}}
  staticMoving={${!state.inertia}}
  dynamicDampingFactor={${state.dynamicDampingFactor}}
  rotateSpeed={${state.rotateSpeed}}
  minDistance={3}
  maxDistance={${state.maxDistance}}
/>`
  return <LessonLayout lessonKey={arc ? 'arcballLesson' : 'trackballLesson'} Demo={BallDemo} Panel={BallPanel} minimalCode={arc ? arcCode : trackCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/introduction' cameraType={name} />
}
