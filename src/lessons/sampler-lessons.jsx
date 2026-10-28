import { useParams } from 'react-router'
import SamplerDemo, { SamplerPanel, useSamplerStore } from '@/scenes/sampler-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson shows the component or hook used to sample mesh surfaces.
export default function SamplerLesson () {
  const { name } = useParams()
  const count = useSamplerStore((state) => state.count)
  const hook = name === 'useSurfaceSampler'
  const transform = `// Move markers slightly outside the surface for visibility.\nfunction placeSample ({ dummy, position }) {\n  dummy.position.copy(position).multiplyScalar(1.025)\n  dummy.scale.setScalar(1)\n}`
  const mesh = `<mesh${hook ? ' ref={mesh}' : ''}><sphereGeometry args={[1.5, 32, 24]} /><meshStandardMaterial color='#c7d2fe' /></mesh>`
  const instances = `<instancedMesh${hook ? ' ref={instances}' : ''} args={[null, null, ${count}]}><sphereGeometry args={[0.045, 8, 6]} /><meshBasicMaterial color='#f97316' /></instancedMesh>`
  const scene = hook ? `const mesh = useRef()\nconst instances = useRef()\nuseSurfaceSampler(mesh, ${count}, placeSample, undefined, instances)\n\n${mesh}\n${instances}` : `<Sampler count={${count}} transform={placeSample}>\n  ${mesh}\n  ${instances}\n</Sampler>`
  const code = `${transform}\n\n${scene}`
  const example = `import { useRef } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n${transform}\n\n// Place orange instances at random positions on the sphere.\nfunction Samples () {\n  ${hook ? `const mesh = useRef()\n  const instances = useRef()\n  useSurfaceSampler(mesh, ${count}, placeSample, undefined, instances)\n  return <>${mesh}${instances}</>` : `return ${scene}`}\n}\n\n// Render the sampled surface.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><directionalLight position={[3, 4, 5]} intensity={3} /><Samples /></Canvas></div> }`
  return <LessonLayout lessonKey={hook ? 'surfaceSamplerLesson' : 'samplerLesson'} Demo={SamplerDemo} Panel={SamplerPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/abstractions/sampler' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Sampler.tsx' />
}
