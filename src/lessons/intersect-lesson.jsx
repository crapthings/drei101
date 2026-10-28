import IntersectDemo, { IntersectPanel, useIntersectStore } from '@/scenes/intersect-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains render-based visibility detection with useIntersect.
export default function IntersectLesson () {
  const x = useIntersectStore((state) => state.x)
  const code = `const ref = useIntersect((visible) => console.log(visible))\n\n<mesh ref={ref} position={[${x}, 0, 0]}>\n  <boxGeometry args={[1.5, 1.5, 1.5]} />\n  <meshStandardMaterial color='indigo' />\n</mesh>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { useIntersect } from '@react-three/drei'\n\n// Log when the mesh starts or stops being rendered.\nfunction Box () {\n  ${code.replace(`position={[${x}, 0, 0]}`, 'position={[0, 0, 0]}').replace('\n\n<mesh', '\n  return <mesh').replaceAll('\n  <box', '\n    <box').replaceAll('\n  <meshStandard', '\n    <meshStandard').replace('\n</mesh>', '\n  </mesh>')}\n}\n\n// Render the observed object.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><directionalLight position={[3, 4, 5]} intensity={3} /><Box /></Canvas></div> }`
  return <LessonLayout lessonKey='intersectLesson' Demo={IntersectDemo} Panel={IntersectPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/misc/use-intersect' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/useIntersect.tsx' />
}
