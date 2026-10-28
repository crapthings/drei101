import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'

// Fit a front-facing scene horizontally on narrow canvases without changing its world scale.
export function ResponsiveFraming ({ halfWidth, minimumDistance, frontDepth = 0 }) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  useLayoutEffect(() => {
    if (!camera.isPerspectiveCamera || size.width <= 0 || size.height <= 0) return
    const aspect = size.width / size.height
    const halfFov = camera.fov * Math.PI / 360
    camera.position.z = Math.max(minimumDistance, frontDepth + halfWidth / (Math.tan(halfFov) * aspect))
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, halfWidth, minimumDistance, frontDepth, invalidate])
  return null
}
