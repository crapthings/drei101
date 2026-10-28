import EffectsDemo, { EffectsPanel, useEffectsStore } from '@/scenes/effects-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains composing a scene render with a grayscale shader pass.
export default function EffectsLesson () {
  const { enabled, amount } = useEffectsStore()
  const code = enabled ? `<Effects multisamping={0}>\n  <shaderPass args={[grayscaleShader]} uniforms-amount-value={${amount}} />\n</Effects>` : '// Effects is disabled.'
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Effects } from '@react-three/drei'\n\n// The shader turns the rendered image into grayscale.\nconst grayscaleShader = {\n  uniforms: { tDiffuse: { value: null }, amount: { value: 1 } },\n  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',\n  fragmentShader: 'uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv; void main() { vec4 c = texture2D(tDiffuse, vUv); float g = dot(c.rgb, vec3(0.299, 0.587, 0.114)); gl_FragColor = vec4(mix(c.rgb, vec3(g), amount), c.a); }'\n}\n\n// Render a scene through an Effects shader pass.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 5] }}>\n    <mesh><boxGeometry /><meshNormalMaterial /></mesh>\n    <Effects multisamping={0}><shaderPass args={[grayscaleShader]} /></Effects>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='effectsLesson' Demo={EffectsDemo} Panel={EffectsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/abstractions/effects' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Effects.tsx' />
}
