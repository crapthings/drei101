import FaceMeshDemo, { FaceMeshPanel, useFaceMeshLessonStore } from '@/scenes/facemesh-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explores the bundled face geometry and eye helpers with sample data.
export default function FaceMeshLesson () {
  const { debug, wireframe } = useFaceMeshLessonStore()
  const code = `const result = FacemeshDatas.SAMPLE_FACELANDMARKER_RESULT\nreturn <Facemesh rotation-z={Math.PI} points={result.faceLandmarks[0]} faceBlendshapes={result.faceBlendshapes[0]} width={2.5} depth={0} eyes debug={${debug}}><meshStandardMaterial wireframe={${wireframe}} side={2} /></Facemesh>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { Facemesh, FacemeshDatas } from '@react-three/drei'\n\n// Render bundled sample landmarks and eye blendshapes.\nexport default function Example () {\n  const sample = FacemeshDatas.SAMPLE_FACELANDMARKER_RESULT\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><directionalLight position={[3, 4, 5]} intensity={3} /><Facemesh rotation-z={Math.PI} points={sample.faceLandmarks[0]} faceBlendshapes={sample.faceBlendshapes[0]} width={2.5} depth={0} eyes debug><meshStandardMaterial wireframe side={2} /></Facemesh></Canvas></div>\n}`
  return <LessonLayout lessonKey='faceMeshLesson' Demo={FaceMeshDemo} Panel={FaceMeshPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/shapes/facemesh' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/Facemesh.tsx' />
}
