import { useParams } from 'react-router'
import FaceControlsDemo, { FaceControlsPanel, useFaceControlsStore } from '@/scenes/face-controls-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson contrasts manual sample data with opt-in live face tracking.
export default function FaceControlsLesson () {
  const { name } = useParams()
  const { smooth, x, y } = useFaceControlsStore()
  const code = `// Sample pose translation: (${x}, ${y}) m\n<FaceControls manualDetect faceLandmarkerResult={sampleResult} smoothTime={${smooth}} offset />\n\n// Live mode: mount this only after the user starts tracking.\n<FaceLandmarker options={{ ...FaceLandmarkerDefaults.options, baseOptions: { ...FaceLandmarkerDefaults.options.baseOptions, delegate: 'CPU' } }}>\n  <Canvas><FaceControls smoothTime={0.25} /></Canvas>\n</FaceLandmarker>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { FaceControls, FacemeshDatas, useFaceControls } from '@react-three/drei'\n\n// Read the control API from its facemesh subtree.\nfunction Observer () {\n  const controls = useFaceControls()\n  return null // controls.computeTarget() returns the current target\n}\n\n// Use bundled data without starting camera detection.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas>\n    <FaceControls manualDetect faceLandmarkerResult={FacemeshDatas.SAMPLE_FACELANDMARKER_RESULT} facemesh={{ children: <Observer /> }} />\n    <mesh position={[0, 0, -4]}><boxGeometry /><meshNormalMaterial /></mesh>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={FaceControlsDemo} Panel={FaceControlsPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/controls/face-controls' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/FaceControls.tsx' />
}
