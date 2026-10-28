import { useParams } from 'react-router'
import ProgressDemo, { ProgressPanel } from '@/scenes/progress-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson contrasts the hook, render-prop component, and built-in overlay.
export default function ProgressLesson () {
  const { name } = useParams()
  const code = name === 'Loader' ? '<Loader dataInterpolation={(progress) => `Loading ${progress.toFixed(0)}%`} />' : name === 'Progress' ? '<Progress>{({ progress, active, errors }) => <p>{active ? progress : errors.length}</p>}</Progress>' : 'const { active, progress, loaded, total, errors } = useProgress()'
  const example = `import { useProgress } from '@react-three/drei'\n\n// Read the state of Three.js's default loading manager.\nexport default function LoadingStatus () {\n  const { active, progress, errors } = useProgress()\n  return <p>{active ? progress.toFixed(0) + '%' : errors.length + ' errors'}</p>\n}`
  const docs = name === 'Loader' ? 'https://drei.docs.pmnd.rs/loaders/loader' : 'https://drei.docs.pmnd.rs/loaders/progress-use-progress'
  const source = name === 'Loader' ? 'https://github.com/pmndrs/drei/blob/master/src/web/Loader.tsx' : 'https://github.com/pmndrs/drei/blob/master/src/core/Progress.tsx'
  return <LessonLayout lessonKey='progressLesson' Demo={ProgressDemo} Panel={ProgressPanel} minimalCode={example} liveCode={code} docs={docs} referenceUrl={source} />
}
