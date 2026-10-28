import { useParams } from 'react-router'
import TraceDemo, { TracePanel, useTraceStore } from '@/scenes/trail-texture-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson contrasts the component and hook interfaces for a pointer trail texture.
export default function TrailTextureLesson () {
  const { name } = useParams()
  const { radius, maxAge, intensity } = useTraceStore()
  const isHook = name === 'useTrailTexture'
  const settings = `radius: ${radius}, maxAge: ${maxAge}, intensity: ${intensity}, interpolate: 4`
  const liveCode = isHook ? `const [texture, onMove] = useTrailTexture({ ${settings} })\n<mesh onPointerMove={onMove}><planeGeometry args={[5, 5]} /><meshBasicMaterial map={texture} /></mesh>` : `<TrailTexture radius={${radius}} maxAge={${maxAge}} intensity={${intensity}} interpolate={4}>\n  {([texture, onMove]) => <mesh onPointerMove={onMove}><planeGeometry args={[5, 5]} /><meshBasicMaterial map={texture} /></mesh>}\n</TrailTexture>`
  const minimal = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Attach the pointer handler and its resulting texture to a plane.\nfunction Surface () {\n  ${isHook ? "const [texture, onMove] = useTrailTexture({ maxAge: 1500 })\n  return <mesh onPointerMove={onMove}><planeGeometry args={[5, 5]} /><meshBasicMaterial map={texture} /></mesh>" : "return <TrailTexture maxAge={1500}>{([texture, onMove]) => <mesh onPointerMove={onMove}><planeGeometry args={[5, 5]} /><meshBasicMaterial map={texture} /></mesh>}</TrailTexture>"}\n}\n\n// Render the interactive surface in a canvas.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}><Surface /></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={TraceDemo} Panel={TracePanel} minimalCode={minimal} liveCode={liveCode} docs='https://github.com/pmndrs/drei/blob/master/src/core/TrailTexture.tsx' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/TrailTexture.tsx' />
}
