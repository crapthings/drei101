import TransformDemo, { TransformPanel, useTransformLessonStore } from '@/scenes/transform-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example attaches a transform gizmo to its child object.
const example = `import { Canvas } from '@react-three/fiber'
import { TransformControls } from '@react-three/drei'

// Drag an axis to translate the wrapped one-meter cube.
export default function Example () {
  return <div>
    <p>Drag an axis arrow to move the cube.</p>
    <div className='h-[400px]'><Canvas camera={{ position: [3, 2, 5] }}>
      <TransformControls mode='translate' size={1.3}>
        <mesh><boxGeometry /><meshNormalMaterial /></mesh>
      </TransformControls>
    </Canvas></div>
  </div>
}`

// The lesson connects the shared reading layout to current gizmo settings.
export default function TransformLesson () {
  const mode = useTransformLessonStore((state) => state.mode)
  const snap = useTransformLessonStore((state) => state.snap)
  const local = useTransformLessonStore((state) => state.local)
  const liveCode = `<TransformControls mode='${mode}' space='${local ? 'local' : 'world'}'\n  translationSnap={${snap ? 0.5 : 'null'}}\n  rotationSnap={${snap ? 'Math.PI / 12' : 'null'}}\n  scaleSnap={${snap ? 0.25 : 'null'}}\n  onObjectChange={readTransform}>\n  <mesh>{/* one-meter cube */}</mesh>\n</TransformControls>`
  return <LessonLayout lessonKey='transformControlsLesson' Demo={TransformDemo} Panel={TransformPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/gizmos/transform-controls' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx' />
}
