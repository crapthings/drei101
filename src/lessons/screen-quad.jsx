import ScreenQuadDemo, { ScreenQuadPanel, useScreenQuadStore } from '@/scenes/screen-quad'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example writes the oversized triangle directly to clip space and colors it.
const example = `import { Canvas } from '@react-three/fiber'
import { ScreenQuad } from '@react-three/drei'

// Map the triangle positions to screen coordinates without camera projection.
const vertexShader = \`varying vec2 vScreenUv;
void main() {
  vScreenUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}\`

// Color each fragment according to its screen position.
const fragmentShader = \`varying vec2 vScreenUv;
void main() {
  gl_FragColor = vec4(vScreenUv.x, vScreenUv.y, 1.0, 1.0);
}\`

// Render a full-canvas shader surface.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas>
    <ScreenQuad><shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader}
      depthTest={false} depthWrite={false} /></ScreenQuad>
  </Canvas></div>
}`

// The lesson describes the current uniform and camera values used by the scene.
export default function ScreenQuadLesson () {
  const { bands, cameraZ } = useScreenQuadStore()
  const liveCode = `// Vertex shader: gl_Position = vec4(position.xy, 0.0, 1.0)\n// Fragment shader: sin(vScreenUv.x * uBands * 2π)\nconst uniforms = useMemo(() => ({ uBands: { value: 4 } }), [])\n// Update the uniform on the actual material when the slider changes.\nuseEffect(() => { material.current.uniforms.uBands.value = ${bands} }, [bands])\n// Camera z: ${cameraZ} m; the vertex shader bypasses camera projection.\n\n<ScreenQuad>\n  <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}\n    depthTest={false} depthWrite={false} />\n</ScreenQuad>`
  return <LessonLayout lessonKey='screenQuadLesson' Demo={ScreenQuadDemo} Panel={ScreenQuadPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/shapes/screen-quad' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/ScreenQuad.tsx' />
}
