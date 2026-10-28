import { useParams } from 'react-router'
import GizmoDemo, { GizmoPanel, useGizmoStore } from '@/scenes/gizmo-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson presents the helper, its two widgets or its camera-tween context.
export default function GizmoLesson () {
  const { name } = useParams()
  const cube = useGizmoStore((state) => state.cube)
  const context = name === 'useGizmoContext'
  const widget = context ? '<CustomGizmo />' : name === 'GizmoViewcube' || (name === 'GizmoHelper' && cube) ? '<GizmoViewcube />' : '<GizmoViewport />'
  const custom = `// Call the helper context from a child inside GizmoHelper.\nfunction CustomGizmo () {\n  const { tweenCamera } = useGizmoContext()\n  return <mesh onClick={() => tweenCamera(new Vector3(0, 0, 1))}><boxGeometry args={[55, 55, 55]} /><meshBasicMaterial color='orange' /></mesh>\n}\n`
  const code = `${context ? custom + '\n' : ''}<GizmoHelper alignment='bottom-right' margin={[85, 85]}>${widget}</GizmoHelper>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { GizmoHelper, ${context ? 'useGizmoContext' : widget === '<GizmoViewcube />' ? 'GizmoViewcube' : 'GizmoViewport'}, OrbitControls } from '@react-three/drei'\n${context ? "import { Vector3 } from 'three'\n\n" + custom : ''}\n// Add an orientation widget to the scene.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [5, 4, 6] }}><mesh><boxGeometry /><meshBasicMaterial color='indigo' /></mesh><OrbitControls makeDefault /><GizmoHelper alignment='bottom-right' margin={[85, 85]}>${widget}</GizmoHelper></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={GizmoDemo} Panel={GizmoPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/gizmos/gizmo-helper' referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name === 'useGizmoContext' ? 'GizmoHelper' : name}.tsx`} />
}
