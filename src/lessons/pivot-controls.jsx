import PivotDemo, { PivotPanel, usePivotLessonStore } from '@/scenes/pivot-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// This standalone example gives a cube an offset pivot and a transform gizmo.
const example = `import { Canvas } from '@react-three/fiber'
import { PivotControls } from '@react-three/drei'

// Drag an axis, plane, rotation arc or scale handle.
export default function Example () {
  return <div>
    <p>Drag a handle to move, rotate or scale around the offset pivot.</p>
    <div className='h-[400px]'><Canvas camera={{ position: [3, 2, 5] }}>
      <PivotControls offset={[0.8, 0, 0]} scale={1.4} depthTest={false}>
        <mesh><boxGeometry /><meshNormalMaterial /></mesh>
      </PivotControls>
    </Canvas></div>
  </div>
}`

// The lesson displays the current pivot and matrix control mode.
export default function PivotLesson () {
  const automatic = usePivotLessonStore((state) => state.automatic)
  const offsetPivot = usePivotLessonStore((state) => state.offsetPivot)
  const limited = usePivotLessonStore((state) => state.limited)
  const liveCode = `<PivotControls matrix={matrix} autoTransform={${automatic}}\n  offset={[${offsetPivot ? '0.8' : '0'}, 0, 0]}\n  translationLimits={${limited ? '[[-0.5, 0.5], undefined, undefined]' : 'undefined'}}\n  onDrag={(local) => { if (!${automatic}) matrix.copy(local) }}>\n  <mesh>{/* 1.5 × 1 × 1 meter object */}</mesh>\n</PivotControls>`
  return <LessonLayout lessonKey='pivotControlsLesson' Demo={PivotDemo} Panel={PivotPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/gizmos/pivot-controls' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/pivotControls/index.tsx' />
}
