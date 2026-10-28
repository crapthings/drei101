import { useParams } from 'react-router'
import ShaderShadowDemo, { ShaderShadowPanel, useShaderShadowStore } from '@/scenes/shader-shadow-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains generated shader uniforms or alpha-aware shadow maps.
export default function ShaderShadowLesson () {
  const { name } = useParams()
  const { enabled, split, opacity } = useShaderShadowStore()
  const shadow = name === 'ShadowAlpha'
  const source = `https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`
  const code = shadow ? `<mesh castShadow><boxGeometry args={[1.3, 1.3, 0.3]} /><meshStandardMaterial transparent opacity={${opacity}} /><ShadowAlpha opacity={${opacity}} /></mesh>` : `<lessonGradientMaterial split={${split}} />`
  const shaderSetup = "// Create a material whose split property updates a GLSL uniform.\nconst LessonGradientMaterial = shaderMaterial(\n  { split: 0.5 },\n  'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',\n  'uniform float split; varying vec2 vUv; void main() { float f = smoothstep(split - 0.08, split + 0.08, vUv.x); gl_FragColor = vec4(mix(vec3(0.24, 0.20, 0.75), vec3(1.0, 0.70, 0.13), f), 1.0); }'\n)\nextend({ LessonGradientMaterial })"
  const example = shadow ? `import { Canvas } from '@react-three/fiber'\nimport { ShadowAlpha } from '@react-three/drei'\n\n// Cast a dithered shadow from a translucent object.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas shadows camera={{ position: [5, 5, 10] }}>\n  <directionalLight castShadow position={[0, 7, 4]} intensity={3} />\n  <mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[10, 8]} /><meshStandardMaterial color='white' /></mesh>\n  <group position={[0, 1.5, 0]}>${code}</group>\n</Canvas></div> }` : `import { Canvas, extend } from '@react-three/fiber'\nimport { shaderMaterial } from '@react-three/drei'\n\n${shaderSetup}\n\n// Use the generated material as a declarative React element.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><mesh><planeGeometry args={[3, 3]} />${code}</mesh></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={ShaderShadowDemo} Panel={ShaderShadowPanel} minimalCode={example} liveCode={enabled ? code : '// Effect disabled'} docs={shadow ? source : 'https://drei.docs.pmnd.rs/shaders/shader-material'} referenceUrl={source} />
}
