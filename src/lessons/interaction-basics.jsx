import { useParams } from 'react-router'
import InteractionDemo, { InteractionPanel, useInteractionStore } from '@/scenes/interaction-basics'
import { LessonLayout } from '@/lessons/lesson-layout'

// Each small standalone example shows the actual drei export used by its lesson.
const snippets = {
  CycleRaycast: `import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CycleRaycast } from '@react-three/drei'

// Wait for a pointer move before allowing CycleRaycast to replay it.
function SafeCycle () {
  const ready = useRef(false)
  const canvas = useThree((state) => state.gl.domElement)
  useEffect(() => {
    const move = (event) => { if (event.target === canvas) ready.current = true }
    const guard = (event) => { if (event.keyCode === 67 && !ready.current) event.stopPropagation() }
    document.addEventListener('pointermove', move, true)
    document.addEventListener('keydown', guard, true)
    return () => {
      document.removeEventListener('pointermove', move, true)
      document.removeEventListener('keydown', guard, true)
    }
  }, [canvas])
  return <CycleRaycast keyCode={67} scroll={false} preventDefault={false} />
}

// Draw overlapping planes and cycle their R3F event order with C; pointer handlers make them eligible for move raycasts.
export default function Example () {
  const [selected, setSelected] = useState('—')
  const [focused, setFocused] = useState(false)
  const area = useRef()
  return (
    <div>
      <p>Focus the scene, move over the planes, press C, then click. Selected: {selected}</p>
      <div ref={area} tabIndex={0} role='group' aria-label='Raycast cycling scene'
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onPointerDown={() => area.current.focus()} className='h-[400px] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-indigo-500'>
        <Canvas camera={{ position: [0, 0, 7] }}>
          {focused && <SafeCycle />}
          {['A', 'B', 'C'].map((name, index) => (
            <mesh key={name} position={[0, 0, -index * 0.5]}
              onPointerOver={() => {}}
              onClick={(event) => { event.stopPropagation(); setSelected(name) }}>
              <planeGeometry args={[2, 2]} />
              <meshBasicMaterial color={['#4f46e5', '#a78bfa', '#38bdf8'][index]} transparent opacity={0.5} />
            </mesh>
          ))}
        </Canvas>
      </div>
    </div>
  )
}`,
  useCursor: `import { useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

// Change only the canvas cursor while the cube is hovered.
function Cube () {
  const [hovered, setHovered] = useState(false)
  const canvas = useThree((state) => state.gl.domElement)
  useCursor(hovered, 'pointer', 'auto', canvas)
  return (
    <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={hovered ? '#a78bfa' : '#6366f1'} />
    </mesh>
  )
}

// Render a hoverable cube.
export default function Example () {
  return <div>
    <p>Move the pointer over the cube, then away from it.</p>
    <div className='h-[400px]'><Canvas><Cube /></Canvas></div>
  </div>
}`,
  DragControls: `import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { DragControls } from '@react-three/drei'

// Drag a one-meter cube in the XY plane with bounded coordinates.
export default function Example () {
  const [position, setPosition] = useState([0, 0])
  return (
    <div>
      <p>Drag the cube. X: {position[0].toFixed(2)} m · Y: {position[1].toFixed(2)} m</p>
      <div className='h-[400px]'>
        <Canvas camera={{ position: [0, 0, 7] }}>
          <DragControls axisLock='z' dragLimits={[[-1.4, 1.4], [-1.4, 1.4], [0, 0]]}
            onDrag={(matrix) => setPosition([matrix.elements[12], matrix.elements[13]].map((value) => Number(value.toFixed(2))))}>
            <mesh><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color='#6366f1' /></mesh>
          </DragControls>
        </Canvas>
      </div>
    </div>
  )
}`
}

// A route-specific lesson connects the current interaction settings to the shared chapter layout.
export default function InteractionLesson () {
  const { name } = useParams()
  const automatic = useInteractionStore((state) => state.automatic)
  const limited = useInteractionStore((state) => state.limited)
  const liveCode = name === 'CycleRaycast'
    ? `<CycleRaycast keyCode={67} scroll={false} preventDefault={false} onChanged={onChanged} />\n// Mount only while focused; allow C after a canvas pointer move.`
    : name === 'useCursor'
      ? `useCursor(hovered, 'pointer', 'auto', canvas)\n// onPointerOver and onPointerOut update hovered.`
      : `<DragControls\n  matrix={matrix}\n  autoTransform={${automatic}}\n  axisLock='z'\n  dragLimits={${limited ? '[[-1.4, 1.4], [-1.4, 1.4], [0, 0]]' : 'undefined'}}\n  onDrag={(local) => { if (!${automatic}) matrix.copy(local) }}\n>`
  const docs = { CycleRaycast: 'misc/cycle-raycast', useCursor: 'misc/use-cursor', DragControls: 'gizmos/drag-controls' }[name]
  const file = { CycleRaycast: 'CycleRaycast', useCursor: 'useCursor', DragControls: 'DragControls' }[name]
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={InteractionDemo} Panel={InteractionPanel} minimalCode={snippets[name]} liveCode={liveCode} docs={`https://drei.docs.pmnd.rs/${docs}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/web/${file}.tsx`} />
}
