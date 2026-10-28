import { useParams } from 'react-router'
import PointMaterialDemo, { PointMaterialPanel, usePointMaterialStore } from '@/scenes/point-material-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson compares the React point material with its underlying Three.js class.
export default function PointMaterialLesson () {
  const { name } = useParams()
  const { size, enabled } = usePointMaterialStore()
  const implementation = name === 'PointMaterialImpl'
  const material = implementation ? `<primitive object={material} attach='material' size={${size}} />` : `<PointMaterial color='#4f46e5' transparent size={${size}} sizeAttenuation={false} depthWrite={false} />`
  const code = `${implementation ? "const material = useMemo(() => new PointMaterialImpl({ color: '#4f46e5', transparent: true, sizeAttenuation: false, depthWrite: false }), [])\nuseEffect(() => () => material.dispose(), [material])\n" : ''}<points>\n  <bufferGeometry><bufferAttribute attach='attributes-position' args={[positions, 3]} /></bufferGeometry>\n  ${material}\n</points>`
  const example = `import { useEffect, useMemo } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Draw three antialiased points from a position buffer.\nfunction Dots () {\n  const positions = useMemo(() => new Float32Array([-1, 0, 0, 0, 0, 0, 1, 0, 0]), [])\n  ${code.replaceAll('\n', '\n  ')}\n}\n\n// Supply a canvas for the point cloud.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}><Dots /></Canvas></div> }`.replace('  <points>', '  return <points>')
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={PointMaterialDemo} Panel={PointMaterialPanel} minimalCode={example} liveCode={enabled ? code : '// Round point material disabled'} docs='https://drei.docs.pmnd.rs/shaders/point-material' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/PointMaterial.tsx' />
}
