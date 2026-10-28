import { useParams } from 'react-router'
import KeyboardLessonDemo, { KeyboardLessonPanel } from '@/scenes/keyboard-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example shows a named key mapping and the hook's non-reactive frame read.
const example = `import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { KeyboardControls, useKeyboardControls } from '@react-three/drei'

// Read the current named action and move at a frame-rate-independent speed.
function Player () {
  const ref = useRef()
  const [, get] = useKeyboardControls()
  useFrame((_, delta) => {
    if (get().forward) ref.current.position.y = Math.min(2, ref.current.position.y + 2 * delta)
  })
  return <mesh ref={ref}><boxGeometry /><meshBasicMaterial color='#4f46e5' /></mesh>
}

// Scope the W action to a focusable canvas area and release it on blur.
export default function Example () {
  const [element, setElement] = useState(null)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    const releaseFocus = () => {
      if (document.activeElement === element) element?.blur()
      setFocused(false)
    }
    window.addEventListener('blur', releaseFocus)
    return () => window.removeEventListener('blur', releaseFocus)
  }, [element])
  return <div ref={setElement} tabIndex={0} role='group' aria-label='Keyboard-controlled scene'
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPointerDown={() => element?.focus()}
    className='focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-indigo-500'>
    <p>Focus the scene and hold W to move the cube up.</p>
    <div className='h-[400px]'><Canvas camera={{ position: [0, 0, 8] }}>
      {focused && element
        ? <KeyboardControls domElement={element} map={[{ name: 'forward', keys: ['KeyW'] }]}><Player /></KeyboardControls>
        : <mesh><boxGeometry /><meshBasicMaterial color='#4f46e5' /></mesh>}
    </Canvas></div>
  </div>
}`

// Both exports receive dedicated explanations while sharing the same keyboard experiment.
export default function KeyboardLesson () {
  const { name } = useParams()
  const liveCode = `<KeyboardControls domElement={focusedElement} map={[\n  { name: 'forward', keys: ['KeyW'] },\n  { name: 'back', keys: ['KeyS'] },\n  { name: 'left', keys: ['KeyA'] },\n  { name: 'right', keys: ['KeyD'] }\n]} onChange={onChange}>\n  <Player /> {/* selector + get() inside useFrame */}\n</KeyboardControls>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={KeyboardLessonDemo} Panel={KeyboardLessonPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/keyboard-controls' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/KeyboardControls.tsx' />
}
