import { useParams } from 'react-router'
import StencilDemo, { StencilPanel, useStencilStore } from '@/scenes/mask-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson focuses on either writing a stencil or applying its material settings.
export default function StencilLesson () {
  const { name } = useParams()
  const { x, radius, inverse } = useStencilStore()
  const code = `<Mask id={1} position={[${x}, 0, 0]}><circleGeometry args={[${radius}, 64]} /><meshBasicMaterial /></Mask>\n<MaskedSurface />\n\nfunction MaskedSurface () {\n  const stencil = useMask(1, ${inverse})\n  return <group position={[0, 0, -0.1]}>\n    <mesh><planeGeometry args={[4, 3]} /><meshBasicMaterial color='#a5b4fc' {...stencil} /></mesh>\n    {[-1.5, -0.5, 0.5, 1.5].map((x) => <mesh key={x} position={[x, 0, 0.01]}>\n      <planeGeometry args={[0.5, 3]} /><meshBasicMaterial color='#4f46e5' {...stencil} />\n    </mesh>)}\n  </group>\n}`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Mask, useMask } from '@react-three/drei'\n\n// Apply the matching stencil to the receiving material.\nfunction Surface () {\n  const stencil = useMask(1)\n  return <mesh position={[0, 0, -0.1]}><planeGeometry args={[4, 3]} /><meshBasicMaterial color='indigo' {...stencil} /></mesh>\n}\n\n// Enable the stencil buffer and draw the mask before its receiver.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas gl={{ stencil: true }} camera={{ position: [0, 0, 6] }}>\n    <Mask id={1}><circleGeometry args={[1, 64]} /><meshBasicMaterial /></Mask>\n    <Surface />\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey={name === 'Mask' ? 'maskLesson' : 'useMaskLesson'} Demo={StencilDemo} Panel={StencilPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/portals/mask' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Mask.tsx' />
}
