import { useParams } from 'react-router'
import MonitorDemo, { MonitorPanel } from '@/scenes/performance-monitor-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the monitor component or its context subscription hook.
export default function MonitorLesson () {
  const { name } = useParams()
  const hook = name === 'usePerformanceMonitor'
  const code = hook ? `function Subscriber () {\n  usePerformanceMonitor({ onDecline: (api) => console.log(api.fps, api.factor) })\n  return null\n}\n\n<PerformanceMonitor><Subscriber /></PerformanceMonitor>` : `<PerformanceMonitor onIncline={(api) => console.log('incline', api.factor)} onDecline={(api) => console.log('decline', api.factor)}>\n  <Scene />\n</PerformanceMonitor>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { PerformanceMonitor${hook ? ', usePerformanceMonitor' : ''} } from '@react-three/drei'\n\n${hook ? "// Subscribe to monitor changes inside its provider.\nfunction Subscriber () { usePerformanceMonitor({ onDecline: (api) => console.log(api.factor) }); return null }\n\n" : ''}// Observe frame-rate trends in the render loop.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas><PerformanceMonitor${hook ? '' : ' onDecline={(api) => console.log(api.factor)}'}>${hook ? '<Subscriber />' : ''}<mesh><boxGeometry /><meshBasicMaterial color='indigo' /></mesh></PerformanceMonitor></Canvas></div> }`
  return <LessonLayout lessonKey={hook ? 'usePerformanceMonitorLesson' : 'performanceMonitorLesson'} Demo={MonitorDemo} Panel={MonitorPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/performances/performance-monitor' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/PerformanceMonitor.tsx' />
}
