import HtmlDemo, { HtmlPanel, useHtmlStore } from '@/scenes/html-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The example attaches a regular DOM label to a 3D position.
const example = `import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'

// Render an HTML label anchored at the origin.
export default function Example () {
  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>
    <Html center distanceFactor={6}><div style={{ background: 'white', padding: 12 }}>Hello, 3D</div></Html>
  </Canvas></div>
}`

// The lesson displays the current anchor and raycast occlusion configuration.
export default function HtmlLesson () {
  const { anchorX, depth, blockerX, occlude } = useHtmlStore()
  const liveCode = `// blocker is a ref attached to the foreground mesh at x = ${blockerX.toFixed(1)} m.\nuseFrame(() => { blocker.current?.updateWorldMatrix(true, false) }, -1)\n\n<Html position={[${anchorX.toFixed(1)}, 0, ${depth.toFixed(1)}]}\n  transform sprite distanceFactor={6}\n  occlude={${occlude ? '[blocker]' : 'undefined'}} pointerEvents='none'>\n  <div>Scene label</div>\n</Html>`
  return <LessonLayout lessonKey='htmlLesson' Demo={HtmlDemo} Panel={HtmlPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/misc/html' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx' />
}
