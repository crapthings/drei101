import { useParams } from 'react-router'
import ScreenDemo, { ScreenPanel, useScreenStore } from '@/scenes/screen-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson displays a focused example and current screen-space settings.
export default function ScreenLesson () {
  const { name } = useParams()
  const { angle, distance, pixels, follow } = useScreenStore()
  const code = {
    Billboard: `<Billboard follow={${follow}}><mesh><planeGeometry args={[1.6, 1.2]} /><meshBasicMaterial color="indigo" /></mesh></Billboard>`,
    ScreenSpace: `<ScreenSpace depth={3}><mesh position={[0, 0.6, 0]}><planeGeometry args={[0.8, 0.3]} /><meshBasicMaterial color="indigo" depthTest={false} /></mesh></ScreenSpace>`,
    ScreenSizer: `<ScreenSizer scale={Math.sqrt(${pixels})}><mesh><planeGeometry /><meshBasicMaterial color="indigo" /></mesh></ScreenSizer>`,
    calculateScaleFactor: `const factor = calculateScaleFactor(worldPosition, ${pixels}, camera, size)\nmesh.scale.setScalar(factor)`
  }
  const content = name === 'calculateScaleFactor' ? `function Marker () {\n  const mesh = useRef()\n  const point = useRef(new Vector3())\n  useFrame(({ camera, size }) => {\n    mesh.current.getWorldPosition(point.current)\n    mesh.current.scale.setScalar(calculateScaleFactor(point.current, 80, camera, size))\n  })\n  return <mesh ref={mesh}><planeGeometry /><meshBasicMaterial color="indigo" /></mesh>\n}` : `function Marker () {\n  return ${code[name]}\n}`
  const example = `import { useRef } from 'react'\nimport { Canvas, useFrame } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\nimport { Vector3 } from 'three'\n\n// Render the helper in the scene.\n${content}\n\n// Create a camera and canvas for the marker.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}><Marker /></Canvas></div>\n}`
  const liveCode = `// Camera angle: ${angle}°; camera distance: ${distance} m.\n${code[name]}`
  const slug = { Billboard: 'billboard', ScreenSpace: 'screen-space', ScreenSizer: 'screen-sizer', calculateScaleFactor: 'screen-sizer' }[name]
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={ScreenDemo} Panel={ScreenPanel} minimalCode={example} liveCode={liveCode} docs={`https://drei.docs.pmnd.rs/abstractions/${slug}`} referenceUrl={name === 'calculateScaleFactor' ? 'https://github.com/pmndrs/drei/tree/master/src/core' : `https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`} />
}
