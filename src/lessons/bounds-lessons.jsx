import { useParams } from 'react-router'
import BoundsDemo, { BoundsPanel, useFramingStore } from '@/scenes/bounds-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains automatic framing and imperative access to the Bounds API.
export default function BoundsLesson () {
  const { name } = useParams()
  const { width, target } = useFramingStore()
  const isHook = name === 'useBounds'
  const example = isHook
    ? `import { Canvas } from '@react-three/fiber'\nimport { Bounds, useBounds } from '@react-three/drei'\n\n// Clicking the mesh asks Bounds to frame that mesh.\nfunction Focusable () {\n  const bounds = useBounds()\n  return <mesh onClick={(event) => { event.stopPropagation(); bounds.refresh(event.object).fit() }}>\n    <boxGeometry /><meshStandardMaterial color="indigo" />\n  </mesh>\n}\n\n// Supply the context used by the hook.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    <Bounds fit observe><Focusable /></Bounds>\n  </Canvas></div>\n}`
    : `import { Canvas } from '@react-three/fiber'\nimport { Bounds } from '@react-three/drei'\n\n// Frame the contents on mount and when the viewport resizes.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    <Bounds fit observe margin={1.4}><mesh><boxGeometry args={[2, 1, 1]} /><meshStandardMaterial color="indigo" /></mesh></Bounds>\n  </Canvas></div>\n}`
  const liveCode = `// The box width is ${width.toFixed(1)} m.\n<Bounds fit observe margin={1.4} maxDuration={0.8}>\n  <Objects />\n</Bounds>\n\n// Inside Objects, focus the chosen object (or all children).\nconst bounds = useBounds()\nbounds.refresh(${target === 'all' ? '' : target + '.current'}).fit()`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={BoundsDemo} Panel={BoundsPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/staging/bounds' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Bounds.tsx' />
}
