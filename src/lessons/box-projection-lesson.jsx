import BoxProjectionDemo, { BoxProjectionPanel, useBoxProjectionStore } from '@/scenes/box-projection-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains box-projected reflections and this project's shader compatibility adaptation.
export default function BoxProjectionLesson () {
  const { boxSize, enabled } = useBoxProjectionStore()
  const example = `import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useBoxProjectedEnv, useEnvironment } from '@react-three/drei'

const files = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(face => '/images/environment/' + face + '.svg')

// Apply the hook and adapt its injection points for Three.js r186.
function Reflector () {
  const texture = useEnvironment({ files })
  const projection = useBoxProjectedEnv([0, 0, 0], [6, 4, 5])
  const compile = (shader) => {
    projection.onBeforeCompile(shader)
    shader.fragmentShader = shader.fragmentShader
      .replace('vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );',
        'vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\\nworldNormal = parallaxCorrectNormal(worldNormal, envMapSize, envMapPosition);')
      .replace('reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );',
        'reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\\nreflectVec = parallaxCorrectNormal(reflectVec, envMapSize, envMapPosition);')
  }
  return <mesh position={[1, 0, 0]}><sphereGeometry />
    <meshStandardMaterial envMap={texture} metalness={1} roughness={0.08} {...projection} onBeforeCompile={compile} />
  </mesh>
}

// Load the local cube map inside the canvas.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <Suspense fallback={null}><Reflector /></Suspense>
  </Canvas></div>
}`
  const liveCode = `const projection = useBoxProjectedEnv([0, 0, 0], [${boxSize.toFixed(1)}, 4, 5])\n// Call projection.onBeforeCompile first, then insert the r186 compatibility patch.\n<meshStandardMaterial envMap={texture} metalness={1} {...projection} onBeforeCompile={compile} />\n// Correction is currently ${enabled ? 'enabled' : 'disabled'}.`
  return <LessonLayout lessonKey='useBoxProjectedEnvLesson' Demo={BoxProjectionDemo} Panel={BoxProjectionPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/misc/use-box-projected-env' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/useBoxProjectedEnv.tsx' />
}
