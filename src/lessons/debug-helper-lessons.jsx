import { useParams } from 'react-router'
import DebugHelperDemo, { DebugHelperPanel, useDebugHelperStore } from '@/scenes/debug-helper-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the shader grid or either light-helper API.
export default function DebugHelperLesson () {
  const { name } = useParams()
  const { spacing, lightX, visible } = useDebugHelperStore()
  const grid = name === 'Grid'
  const hook = name === 'useHelper'
  const code = grid ? `<Grid args={[12, 12]} cellSize={${spacing}} sectionSize={${spacing * 5}} cellColor='#a5b4fc' sectionColor='#4f46e5' />` : hook ? `const light = useRef()\nuseHelper(${visible ? 'light' : 'false'}, DirectionalLightHelper, 0.8, '#f97316')\n<directionalLight ref={light} position={[${lightX}, 4, 3]} intensity={3} />` : `<directionalLight position={[${lightX}, 4, 3]} intensity={3}>\n  ${visible ? "<Helper type={DirectionalLightHelper} args={[0.8, '#f97316']} />" : '{/* Helper is hidden. */}'}\n</directionalLight>`
  const example = `import { useRef } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name}, OrbitControls } from '@react-three/drei'\n${grid ? '' : "import { DirectionalLightHelper } from 'three'\n"}\n// Add a grid or a light helper to a simple scene.\nfunction Scene () {\n  ${hook ? `const light = useRef()\n  useHelper(light, DirectionalLightHelper, 0.8, '#f97316')\n  return <><directionalLight ref={light} position={[3, 4, 3]} intensity={3} /><mesh><boxGeometry /><meshStandardMaterial color='indigo' /></mesh></>` : `return <>${code}<mesh position={[0, 0.5, 0]}><boxGeometry /><meshStandardMaterial color='indigo' /></mesh>${grid ? '<directionalLight position={[3, 4, 3]} intensity={3} />' : ''}</>`}\n}\n\n// Render the diagnostic scene.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [6, 5, 8] }}><Scene /><OrbitControls /></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={DebugHelperDemo} Panel={DebugHelperPanel} minimalCode={example} liveCode={code} docs={`https://drei.docs.pmnd.rs/gizmos/${grid ? 'grid' : 'helper'}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${grid ? 'Grid' : 'Helper'}.tsx`} />
}
