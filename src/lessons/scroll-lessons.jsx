import { useParams } from 'react-router'
import ScrollLessonDemo, { ScrollLessonPanel, useScrollLessonStore } from '@/scenes/scroll-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The standalone example demonstrates the three related exports in a single working scene.
const example = `import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Scroll, ScrollControls, useScroll } from '@react-three/drei'

// Scale the cube as scroll progress crosses the middle interval.
function Cube () {
  const ref = useRef()
  const scroll = useScroll()
  const events = useThree((state) => state.events)
  // Keep the event target on the scroll element if Canvas reconnects it.
  useEffect(() => {
    if (scroll.el.isConnected && events.connected !== scroll.el) events.connect?.(scroll.el)
  }, [events, scroll])
  useFrame(() => { ref.current.scale.x = 1 + scroll.range(0.25, 0.5) })
  return <mesh ref={ref} position={[-1, 0, 0]}><boxGeometry /><meshBasicMaterial color='#6366f1' /></mesh>
}

// A fixed cube reads progress while a second cube moves with Scroll.
export default function Example () {
  return <div className='h-[400px]'><Canvas>
    <ScrollControls pages={3} damping={0.25}>
      <Cube />
      <Scroll><mesh position={[1, 0, 0]}><boxGeometry /><meshBasicMaterial color='#38bdf8' /></mesh></Scroll>
    </ScrollControls>
  </Canvas></div>
}`

// Each route explains one export while showing its relationship with the others.
export default function ScrollLesson () {
  const { name } = useParams()
  const horizontal = useScrollLessonStore((state) => state.horizontal)
  const slow = useScrollLessonStore((state) => state.slow)
  const liveCode = `<ScrollControls pages={3} horizontal={${horizontal}} damping={${slow ? 0.8 : 0.25}}>\n  <Observer /> {/* samples useScroll and preserves progress when damping changes */}\n  <Scroll>{/* 3D objects positioned one viewport apart */}</Scroll>\n  <Scroll html>{/* HTML labels positioned one viewport apart */}</Scroll>\n</ScrollControls>`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={ScrollLessonDemo} Panel={ScrollLessonPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/scroll-controls' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/ScrollControls.tsx' />
}
