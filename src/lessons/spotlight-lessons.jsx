import { useParams } from 'react-router'
import SpotlightDemo, { SpotlightPanel, useSpotlightStore } from '@/scenes/spotlight-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the volumetric spotlight or its projected shadow mask.
export default function SpotlightLesson () {
  const { name } = useParams()
  const { lightX, angle, opacity, distance, mask } = useSpotlightStore()
  const shader = "const stripeShader = `varying vec2 vUv; void main() { float stripe = step(0.5, fract(vUv.x * 6.0)); gl_FragColor = vec4(vec3(stripe), 1.0); }`"
  const shadow = name === 'SpotLightShadow' && mask ? `<SpotLightShadow distance={${distance}} scale={2.5} shader={stripeShader} />` : ''
  const code = `<SpotLight position={[${lightX}, 5, 1]} angle={${angle}} distance={8} intensity={90} opacity={${opacity}} castShadow>\n  ${shadow}\n</SpotLight>`
  const exampleCode = name === 'SpotLightShadow' && !mask ? code.replace('  \n</SpotLight>', `  <SpotLightShadow distance={${distance}} scale={2.5} shader={stripeShader} />\n</SpotLight>`) : code
  const example = `import { Canvas } from '@react-three/fiber'\nimport { SpotLight${name === 'SpotLightShadow' ? ', SpotLightShadow' : ''} } from '@react-three/drei'\n\n${name === 'SpotLightShadow' ? `// The shader generates a striped shadow mask.\n${shader}\n` : ''}\n// Project a spotlight onto a receiving floor.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas shadows camera={{ position: [6, 4, 8] }}>\n    ${exampleCode}\n    <mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} /><meshStandardMaterial color='white' /></mesh>\n  </Canvas></div>\n}`
  const slug = name === 'SpotLight' ? 'spot-light' : 'spot-light-shadow'
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={SpotlightDemo} Panel={SpotlightPanel} minimalCode={example} liveCode={`${name === 'SpotLightShadow' ? `${shader}\n` : ''}${code}`} docs={`https://drei.docs.pmnd.rs/staging/${slug}`} referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/SpotLight.tsx' />
}
