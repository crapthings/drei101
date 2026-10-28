import { useParams } from 'react-router'
import MotionDemo, { MotionPanel, useMotionLessonStore } from '@/scenes/motion-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example uses a curve and a mutable hook target to drive an object.
const example = `import { useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MotionPathControls, useMotion } from '@react-three/drei'
import { CubicBezierCurve3, Vector3 } from 'three'

// Advance the target progress over time when no offset prop is supplied.
function Advance () {
  const motion = useMotion()
  useFrame((_, delta) => { motion.current += delta * 0.1 })
  return null
}

// Move a one-meter cube along an open curve whose debug points show the path.
function Scene () {
  const [object, setObject] = useState(null)
  const objectRef = useMemo(() => ({ current: object }), [object])
  const curves = useMemo(() => [new CubicBezierCurve3(
    new Vector3(-3, -1, 0), new Vector3(-2, 2, 0),
    new Vector3(2, -2, 0), new Vector3(3, 1, 0)
  )], [])
  return <><mesh ref={setObject}><boxGeometry /><meshBasicMaterial color='#4f46e5' /></mesh>
    {object && <MotionPathControls object={objectRef} curves={curves} loop debug debugColor='#a5b4fc'><Advance /></MotionPathControls>}</>
}

// Render the moving object inside a canvas.
export default function Example () {
  return <div className='h-[400px]'><Canvas camera={{ position: [0, 0, 9] }}><Scene /></Canvas></div>
}`

// The two related exports receive dedicated explanations and one shared experiment.
export default function MotionLesson () {
  const { name } = useParams()
  const controlled = useMotionLessonStore((state) => state.controlled)
  const target = useMotionLessonStore((state) => state.target)
  const loop = useMotionLessonStore((state) => state.loop)
  const focus = useMotionLessonStore((state) => state.focus)
  const movingFocus = useMotionLessonStore((state) => state.movingFocus)
  const slow = useMotionLessonStore((state) => state.slow)
  const liveCode = `const focusPoint = [0, 2.4, 0]\nconst focusRef = useRef() // attached to the moving target mesh\n\n{object && <MotionPathControls curves={curves} object={objectRef} loop={${loop}}\n  focus={${focus ? (movingFocus ? 'focusRef' : 'focusPoint') : 'undefined'}} offset={${controlled ? target.toFixed(2) : 'undefined'}} damping={${slow ? 0.8 : 0.25}}>\n  <Observer /> {/* ${controlled ? 'read object, offset, point and tangent' : `motion.current = ${target.toFixed(2)}`} */}\n</MotionPathControls>}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={MotionDemo} Panel={MotionPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/motion-path-controls' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/MotionPathControls.tsx' />
}
