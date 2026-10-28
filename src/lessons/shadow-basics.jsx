import { useParams } from 'react-router'
import ShadowBasicsDemo, { ShadowBasicsPanel, useShadowBasicsStore } from '@/scenes/shadow-basics'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains a selected shadow technique or the curved studio backdrop.
export default function ShadowBasicsLesson () {
  const { name } = useParams()
  const { x, height, lightX, blur, colorStop, opacity, size, floor, enabled } = useShadowBasicsStore()
  const usage = {
    Shadow: `<Shadow position={[${x}, 0.005, 0]} scale={2} opacity={${opacity}} colorStop={${colorStop.toFixed(2)}} />`,
    ContactShadows: `<ContactShadows scale={7} blur={${blur}} opacity={${opacity}} far={4} resolution={512} />`,
    SoftShadows: `${enabled ? `<SoftShadows size={${size}} samples={16} focus={0} />` : '// SoftShadows is disabled.'}\n<directionalLight castShadow position={[${lightX}, 6, 4]} />`,
    Backdrop: `<Backdrop receiveShadow floor={${floor}} segments={32} scale={[6, 6, 6]}>\n  <meshStandardMaterial color='#c7d2fe' />\n</Backdrop>`
  }
  const surface = name === 'Backdrop' ? usage.Backdrop : `<mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]}${name === 'SoftShadows' ? ' receiveShadow' : ''}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='white' /></mesh>`
  const helper = name === 'Backdrop' ? '' : name === 'SoftShadows' ? (enabled ? `<SoftShadows size={${size}} samples={16} focus={0} />` : '{/* SoftShadows is disabled. */}') : usage[name]
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Render an object and the selected helper on a shadow-enabled canvas.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas shadows camera={{ position: [5, 4, 8], fov: 45 }}>\n    <directionalLight${name === 'Backdrop' || name === 'SoftShadows' ? ' castShadow' : ''} position={[${lightX}, 6, 4]} intensity={3} />\n    ${surface}\n    <mesh${name === 'Backdrop' || name === 'SoftShadows' ? ' castShadow' : ''} position={[${x}, ${height + 0.65}, 0]}><sphereGeometry args={[0.65, 32, 24]} /><meshStandardMaterial color='indigo' /></mesh>\n    ${helper}\n  </Canvas></div>\n}`
  const slug = { Shadow: 'staging/shadow', ContactShadows: 'staging/contact-shadows', SoftShadows: 'shaders/soft-shadows', Backdrop: 'staging/backdrop' }[name]
  const file = name === 'SoftShadows' ? 'softShadows' : name
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={ShadowBasicsDemo} Panel={ShadowBasicsPanel} minimalCode={example} liveCode={usage[name]} docs={`https://drei.docs.pmnd.rs/${slug}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${file}.tsx`} />
}
