import StageDemo, { StagePanel, useStageStore } from '@/scenes/stage-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the combined studio setup created by the Stage component.
export default function StageLesson () {
  const { preset, intensity, shadows } = useStageStore()
  const usage = `<Stage environment={null} adjustCamera={false} preset='${preset}' intensity={${intensity}} shadows={${shadows ? "'contact'" : 'false'}} >\n  <mesh castShadow><torusKnotGeometry args={[0.75, 0.24, 128, 24]} /><meshStandardMaterial color='indigo' /></mesh>\n</Stage>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Stage } from '@react-three/drei'\n\n// Center and light a model with the built-in stage.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas shadows camera={{ position: [4, 3, 7], fov: 45 }}>\n    ${usage}\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey='stageLesson' Demo={StageDemo} Panel={StagePanel} minimalCode={example} liveCode={usage} docs='https://drei.docs.pmnd.rs/staging/stage' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Stage.tsx' />
}
