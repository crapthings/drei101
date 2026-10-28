import { useParams } from 'react-router'
import DetectGpuDemo, { DetectGpuPanel } from '@/scenes/detect-gpu-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the component or hook for asynchronous GPU tier detection.
export default function DetectGpuLesson () {
  const { name } = useParams()
  const hook = name === 'useDetectGPU'
  const code = hook ? `const gpu = useDetectGPU({ benchmarksURL: '/benchmarks' })\nreturn <p>Tier: {gpu.tier} · {gpu.type}</p>` : `<DetectGPU benchmarksURL='/benchmarks'>\n  {(gpu) => <p>Tier: {gpu.tier} · {gpu.type}</p>}\n</DetectGPU>`
  const example = `import { Suspense } from 'react'\nimport { ${name} } from '@react-three/drei'\n\n// Render the estimated tier once detection completes.\nfunction Result () {\n  ${hook ? code : `return ${code}`}\n}\n\n// Suspend while detection runs.\nexport default function Example () { return <Suspense fallback={<p>Detecting GPU…</p>}><Result /></Suspense> }`
  return <LessonLayout lessonKey={hook ? 'useDetectGpuLesson' : 'detectGpuLesson'} Demo={DetectGpuDemo} Panel={DetectGpuPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/detect-gpu-use-detect-gpu' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/DetectGPU.tsx' />
}
