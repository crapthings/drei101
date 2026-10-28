import FaceLandmarkerDemo, { FaceLandmarkerEmbedPanel as FaceLandmarkerPanel } from '@/scenes/face-landmarker-embed'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains detector initialization, defaults and context access.
export default function FaceLandmarkerLesson () {
  const code = `const options = { ...FaceLandmarkerDefaults.options, baseOptions: { ...FaceLandmarkerDefaults.options.baseOptions, delegate: 'CPU' }, runningMode: 'IMAGE' }\n<FaceLandmarker options={options}><DetectImage /></FaceLandmarker>`
  const example = `import { Suspense, useEffect } from 'react'\nimport { FaceLandmarker, FaceLandmarkerDefaults, useFaceLandmarker } from '@react-three/drei'\n\n// Detect landmarks in a local image after the provider is ready.\nfunction DetectImage ({ image }) {\n  const detector = useFaceLandmarker()\n  useEffect(() => { console.log(detector.detect(image)) }, [detector, image])\n  return null\n}\n\n// Use image mode and the CPU delegate.\nfunction Example ({ image }) {\n  const options = { ...FaceLandmarkerDefaults.options, baseOptions: { ...FaceLandmarkerDefaults.options.baseOptions, delegate: 'CPU' }, runningMode: 'IMAGE' }\n  return <Suspense fallback={null}><FaceLandmarker options={options}><DetectImage image={image} /></FaceLandmarker></Suspense>\n}`
  return <LessonLayout lessonKey='faceLandmarkerLesson' Demo={FaceLandmarkerDemo} Panel={FaceLandmarkerPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/misc/face-landmarker' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/FaceLandmarker.tsx' />
}
