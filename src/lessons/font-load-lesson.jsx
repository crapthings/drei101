import FontLoadDemo, { FontLoadPanel, useFontLessonStore } from '@/scenes/font-load-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains loading a Three.js font and generating glyph shapes.
export default function FontLoadLesson () {
  const { word, depth } = useFontLessonStore()
  const code = `const font = useFont('/fonts/helvetiker_regular.typeface.json')\nconst shapes = font.generateShapes('${word}', 0.9)\nreturn <mesh><extrudeGeometry args={[shapes, { depth: ${depth}, bevelEnabled: false }]} /><meshStandardMaterial color='#6366f1' /></mesh>`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { Center, useFont } from '@react-three/drei'\n\n// Load a typeface and extrude the generated glyph shapes.\nfunction Word () {\n  const font = useFont('/fonts/helvetiker_regular.typeface.json')\n  const shapes = font.generateShapes('${word}', 0.9)\n  return <Center><mesh><extrudeGeometry args={[shapes, { depth: ${depth}, bevelEnabled: false }]} /><meshStandardMaterial color='#6366f1' /></mesh></Center>\n}\n\n// Wait for the local font before rendering the word.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}><directionalLight position={[3, 5, 6]} intensity={3} /><Suspense fallback={null}><Word /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey='useFontLesson' Demo={FontLoadDemo} Panel={FontLoadPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/loaders/use-font' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/useFont.tsx' />
}
