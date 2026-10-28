import OrientationDemo, { OrientationPanel, useOrientationStore } from '@/scenes/device-orientation'
import { LessonLayout } from '@/lessons/lesson-layout'

// A permission-gated example keeps sensor control construction behind an explicit user action.
const minimalCode = `import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { DeviceOrientationControls } from '@react-three/drei'

// Request sensor access only in response to the enable button.
export default function Example () {
  const [enabled, setEnabled] = useState(false)
  const [status, setStatus] = useState('Ready')
  const enable = async () => {
    if (!window.isSecureContext || !window.DeviceOrientationEvent) {
      setStatus('Secure context and device support required')
      return
    }
    try {
      const request = window.DeviceOrientationEvent.requestPermission
      const result = request
        ? await request.call(window.DeviceOrientationEvent)
        : 'granted'
      setEnabled(result === 'granted')
      setStatus(result)
    } catch {
      setStatus('Sensor permission unavailable')
    }
  }
  return (
    <div>
      <button onClick={enable}>Enable sensors</button>
      <button onClick={() => setEnabled(false)}>Stop</button>
      <p role='status'>{status}</p>
      <div className='h-[400px]'>
        <Canvas camera={{ position: [0, 0, 0] }}>
          <mesh position={[0, 0, -5]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color='#6366f1' />
          </mesh>
          {enabled && <DeviceOrientationControls makeDefault />}
        </Canvas>
      </div>
    </div>
  )
}`

// Sensor and preview states have distinct examples so the page never mislabels simulated input.
export default function OrientationLesson () {
  const mode = useOrientationStore((state) => state.mode)
  const offset = useOrientationStore((state) => state.offset)
  const liveCode = mode === 'sensor'
    ? `<DeviceOrientationControls
  makeDefault
  alphaOffset={${offset} * Math.PI / 180}
/>`
    : `// Math preview only; no sensor controller is mounted.
// The preview uses Euler(beta, alpha, -gamma, 'YXZ')
// followed by a -90 degree X-axis camera correction.
// Enable device orientation to run DeviceOrientationControls.`
  return <LessonLayout lessonKey='orientationLesson' Demo={OrientationDemo} Panel={OrientationPanel} minimalCode={minimalCode} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/introduction' referenceUrl='https://github.com/pmndrs/three-stdlib/blob/main/src/controls/DeviceOrientationControls.ts' />
}
