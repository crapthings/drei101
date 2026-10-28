import FisheyeDemo, { FisheyePanel, useFisheyeStore } from '@/scenes/fisheye-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains cube-captured fisheye rendering and its controls.
export default function FisheyeLesson () {
  const { enabled, zoom } = useFisheyeStore()
  const code = enabled ? `<Fisheye zoom={${zoom}} resolution={256} segments={64}>\n  <SceneContent />\n</Fisheye>` : '<SceneContent /> // Normal perspective view'
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Fisheye } from '@react-three/drei'\n\n// Render a child scene through a fisheye projection.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 2, 6] }}>\n    <Fisheye zoom={0} resolution={256}>\n      <color attach='background' args={['#e0e7ff']} />\n      <mesh><boxGeometry /><meshNormalMaterial /></mesh>\n    </Fisheye>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='fisheyeLesson' Demo={FisheyeDemo} Panel={FisheyePanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/portals/fisheye' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Fisheye.tsx' />
}
