import { useParams } from 'react-router'
import WalkDemo, { FirstPersonPanel, LockPanel, useFirstPersonStore, useLockStore } from '@/scenes/first-person-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// The minimal pointer-lock example deliberately contains no application-defined keyboard movement.
const lockCode = `import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'

// Enter from a dedicated button and exit using the browser's Escape shortcut.
export default function Example () {
  return (
    <div>
      <button id='enter-lock'>Enter · Esc exits</button>
      <div className='h-[400px]'>
        <Canvas camera={{ position: [0, 1.6, 8] }}>
          <gridHelper args={[30, 30]} />
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshBasicMaterial color='#6366f1' />
          </mesh>
          <PointerLockControls makeDefault selector='#enter-lock' pointerSpeed={1} />
        </Canvas>
      </div>
    </div>
  )
}`

// Native first-person usage includes explicit disposal for the installed wrapper's listener lifecycle.
const firstCode = `import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { FirstPersonControls } from '@react-three/drei'

// Dispose native listeners when this scene leaves the page.
function Controls () {
  const ref = useRef(null)
  useEffect(() => {
    const control = ref.current
    control.dispose()
    control.connect(control.domElement)
    return () => control.dispose()
  }, [])
  return <FirstPersonControls ref={ref} makeDefault movementSpeed={3} lookSpeed={0.05} />
}

// This native example uses global keyboard defaults; the full lesson scopes input to canvas focus.
export default function Example () {
  return (
    <div className='h-[400px]'>
      <Canvas camera={{ position: [0, 1.6, 8] }}>
        <gridHelper args={[30, 30]} />
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshBasicMaterial color='#6366f1' />
        </mesh>
        <Controls />
      </Canvas>
    </div>
  )
}`

// Distinct source examples expose the difference between relative pointer rotation and native movement.
export default function WalkLesson () {
  const { name } = useParams()
  const lock = name === 'PointerLockControls'
  const lockState = useLockStore()
  const firstState = useFirstPersonStore()
  const liveCode = lock
    ? `const canvas = useThree((state) => state.gl.domElement)

<PointerLockControls
  domElement={canvas}
  makeDefault
  selector='#pointer-lock-enter'
  pointerSpeed={${lockState.pointerSpeed}}
  minPolarAngle={${90 - lockState.pitch} * Math.PI / 180}
  maxPolarAngle={${90 + lockState.pitch} * Math.PI / 180}
  onLock={onLock}
  onUnlock={onUnlock}
/>
// Application movement: ${lockState.walking ? 'enabled' : 'disabled'}
// When enabled and locked, WASD calls moveForward/moveRight.
// movementSpeed = ${lockState.movementSpeed} m/s; this is not a control prop.`
    : `<FirstPersonControls
  ref={controls}
  makeDefault
  enabled={${firstState.active && firstState.focused}}
  movementSpeed={${firstState.movementSpeed}}
  lookSpeed={${firstState.lookSpeed}}
  activeLook={${firstState.activeLook}}
  lookVertical={${firstState.lookVertical}}
/>
// Focus-scoped listeners and disposal are added by the full demo.`
  return <LessonLayout lessonKey={lock ? 'pointerLockLesson' : 'firstPersonLesson'} Demo={WalkDemo} Panel={lock ? LockPanel : FirstPersonPanel} minimalCode={lock ? lockCode : firstCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/introduction' cameraType={name} />
}
