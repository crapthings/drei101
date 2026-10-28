import { useParams } from 'react-router'
import SelectionDemo, { SelectionPanel, useSelectionLessonStore } from '@/scenes/select-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example highlights the actual mesh returned by useSelect.
const example = `import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Select, useSelect } from '@react-three/drei'

// Compare this mesh with the selected Object3D instances.
function Cube ({ position }) {
  const ref = useRef()
  const selected = useSelect()
  return <mesh ref={ref} position={position}><boxGeometry /><meshBasicMaterial color={selected.includes(ref.current) ? 'orange' : 'indigo'} /></mesh>
}

// Select provides a shared selection to its descendants.
export default function Example () {
  return <div>
    <p>Click a cube; Shift-click the other to select both.</p>
    <div className='h-[400px]'><Canvas><Select multiple>
      <Cube position={[-1, 0, 0]} /><Cube position={[1, 0, 0]} />
    </Select></Canvas></div>
  </div>
}`

// Separate routes explain the selection provider and its consumer hook.
export default function SelectionLesson () {
  const { name } = useParams()
  const mode = useSelectionLessonStore((state) => state.mode)
  const liveCode = `<Select multiple${mode === 'box' ? ' box' : ''} onChangePointerUp={(items) => setSelected(items.map((item) => item.name))}>\n  <SelectableCube name='A' />\n  <SelectableCube name='B' />\n  <SelectableCube name='C' />\n</Select>\n// Each cube uses useSelect().includes(ref.current).`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={SelectionDemo} Panel={SelectionPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/misc/select' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/Select.tsx' />
}
