import { useParams } from 'react-router'
import EnvironmentDemo, { EnvironmentPanel, useEnvironmentStore } from '@/scenes/environment-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson shows how each environment export supplies the reflective material.
export default function EnvironmentLesson () {
  const { name } = useParams()
  const { background, intensity, roughness } = useEnvironmentStore()
  const fileCode = `const files = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(face => '/images/environment/' + face + '.svg')`
  const samples = {
    Environment: `<Environment files={files} background={${background}} environmentIntensity={${intensity}} />`,
    EnvironmentCube: `<EnvironmentCube files={files} background={${background}} environmentIntensity={${intensity}} />`,
    EnvironmentMap: `const texture = useEnvironment({ files })\n<EnvironmentMap map={texture} background={${background}} environmentIntensity={${intensity}} />`,
    useEnvironment: `const texture = useEnvironment({ files })\n<meshStandardMaterial envMap={texture} envMapIntensity={${intensity}} metalness={1} roughness={${roughness}} />`,
    EnvironmentPortal: `<EnvironmentPortal background={${background}} environmentIntensity={${intensity}} resolution={128} frames={1}>\n  <color attach='background' args={['#3730a3']} />\n  <mesh position={[0, 1, -4]}><planeGeometry args={[5, 2]} /><meshBasicMaterial color='white' /></mesh>\n</EnvironmentPortal>`
  }
  const helper = name === 'EnvironmentMap' ? 'EnvironmentMap, useEnvironment' : name
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${helper} } from '@react-three/drei'\n\n${name === 'EnvironmentPortal' ? '' : fileCode + '\n\n'}// Load or capture the environment and apply it to a metal surface.\nfunction Scene () {\n  ${name === 'EnvironmentMap' || name === 'useEnvironment' ? 'const texture = useEnvironment({ files })\n  ' : ''}return <>${name === 'useEnvironment' ? '' : samples[name].replace('const texture = useEnvironment({ files })\n','')}<mesh><sphereGeometry args={[1.5, 48, 32]} /><meshStandardMaterial metalness={1} roughness={0.15}${name === 'useEnvironment' ? ' envMap={texture}' : ''} /></mesh></>\n}\n\n// Provide the canvas and loading boundary.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><Suspense fallback={null}><Scene /></Suspense></Canvas></div>\n}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={EnvironmentDemo} Panel={EnvironmentPanel} minimalCode={example} liveCode={`${name === 'EnvironmentPortal' ? '' : fileCode + '\n'}${samples[name]}`} docs={`https://drei.docs.pmnd.rs/staging/${name === 'useEnvironment' ? 'use-environment' : 'environment'}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name === 'useEnvironment' ? 'useEnvironment' : 'Environment'}.tsx`} />
}
