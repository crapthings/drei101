import ComputedAttributeDemo, { ComputedAttributePanel, useComputedStore } from '@/scenes/computed-attribute-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains computing a named buffer attribute from geometry.
export default function ComputedAttributeLesson () {
  const boundary = useComputedStore((state) => state.boundary)
  const code = `const compute = (geometry) => {\n  const positions = geometry.attributes.position\n  const values = new Float32Array(positions.count)\n  for (let i = 0; i < positions.count; i++) values[i] = positions.getX(i) >= ${boundary} ? 1 : 0\n  return new BufferAttribute(values, 1)\n}\n\n<planeGeometry args={[4, 2.5, 80, 1]}>\n  <ComputedAttribute name='weight' compute={compute} />\n</planeGeometry>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ComputedAttribute } from '@react-three/drei'\nimport { BufferAttribute } from 'three'\n\n// Compute an RGB color for each vertex from its position.\nfunction compute (geometry) {\n  const p = geometry.attributes.position\n  const colors = new Float32Array(p.count * 3)\n  for (let i = 0; i < p.count; i++) colors.set(p.getX(i) > 0 ? [1, 0.5, 0] : [0.2, 0.2, 1], i * 3)\n  return new BufferAttribute(colors, 3)\n}\n\n// Attach the computed color attribute to a segmented plane.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><mesh><planeGeometry args={[4, 2.5, 80, 1]}><ComputedAttribute name='color' compute={compute} /></planeGeometry><meshBasicMaterial vertexColors /></mesh></Canvas></div> }`
  return <LessonLayout lessonKey='computedAttributeLesson' Demo={ComputedAttributeDemo} Panel={ComputedAttributePanel} minimalCode={example} liveCode={code} docs='https://github.com/pmndrs/drei/blob/master/src/core/ComputedAttribute.tsx' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/ComputedAttribute.tsx' />
}
