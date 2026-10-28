import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { useDemoStore } from '@/store'

// The camera and three equal cubes expose perspective and clipping without external assets.
function CameraScene () {
  const { fov, distance, near, far } = useDemoStore()

  return (
    <>
      <color attach='background' args={['#eef2ff']} />
      <PerspectiveCamera makeDefault position={[0, 2, distance]} fov={fov} near={near} far={far} />
      <directionalLight position={[3, 8, 5]} intensity={3} />
      <directionalLight position={[-4, 3, -4]} intensity={1.2} color='#e0e7ff' />
      <gridHelper args={[60, 60, '#a5b4fc', '#dce2f5']} position={[0, -0.01, -12]} />
      {[[-1.3, 0.5, 2, '#6366f1'], [0, 0.5, -2, '#818cf8'], [1.3, 0.5, -6, '#a5b4fc']].map(([x, y, z, color]) => (
        <mesh key={z} position={[x, y, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
        </mesh>
      ))}
    </>
  )
}

// The lazy-loaded demo owns its canvas so leaving the page releases its renderer.
export default function PerspectiveDemo () {
  const { t } = useTranslation()

  return (
    <div className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100 lg:h-[66vh]' role='img' aria-label={t('ui.scene')}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 8] }}>
        <CameraScene />
      </Canvas>
      <div className='pointer-events-none absolute left-5 top-5 rounded-full border border-indigo-100 bg-white/90 shadow-sm px-3 py-1.5 font-mono text-[11px] text-indigo-700'>1 unit = 1 m · 3 × 1 m³</div>
    </div>
  )
}
