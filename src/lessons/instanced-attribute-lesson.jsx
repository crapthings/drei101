import InstancedAttributeDemo, { InstancedAttributePanel, useAttributeStore } from '@/scenes/instanced-attribute-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains sending custom values from instances into a shader attribute.
export default function InstancedAttributeLesson () {
  const offset = useAttributeStore((state) => state.offset)
  const code = `<Instances limit={20}>\n  <planeGeometry /><shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} />\n  <InstancedAttribute name='heat' defaultValue={0} />\n  <Instance heat={Math.max(0, Math.min(1, index / 19 + ${offset}))} />\n</Instances>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Instance, InstancedAttribute, Instances } from '@react-three/drei'\n\n// Read the instance attribute in a shader.\nconst vertex = 'attribute float heat; varying float vHeat; void main() { vHeat = heat; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }'\nconst fragment = 'varying float vHeat; void main() { gl_FragColor = vec4(vHeat, 0.2, 1.0 - vHeat, 1.0); }'\n\n// Assign a different value to each instance.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Instances limit={2}><planeGeometry /><shaderMaterial vertexShader={vertex} fragmentShader={fragment} /><InstancedAttribute name='heat' defaultValue={0} /><Instance position={[-1, 0, 0]} heat={0} /><Instance position={[1, 0, 0]} heat={1} /></Instances></Canvas></div> }`
  return <LessonLayout lessonKey='instancedAttributeLesson' Demo={InstancedAttributeDemo} Panel={InstancedAttributePanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/instances' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Instances.tsx' />
}
