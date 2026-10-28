import { useParams } from 'react-router'
import CloudDemo, { CloudPanel, useCloudStore } from '@/scenes/cloud-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson contrasts the cloud provider with its cloud and instance children.
export default function CloudLesson () {
  const { name } = useParams()
  const { segments, volume, speed, opacity } = useCloudStore()
  const item = name === 'CloudInstance' ? 'CloudInstance' : 'Cloud'
  const cloud = `<${item} seed={1} bounds={[1.5, 0.5, 0.5]} segments={${segments}} volume={${volume}} speed={${speed}} opacity={${opacity}} />`
  const liveCode = `<Clouds texture='/images/cloud-puff.svg' material={MeshBasicMaterial} limit={120}>\n  ${cloud}\n  <${item} seed={2} position={[1.7, 0.5, -1]} bounds={[1.2, 0.5, 0.5]} segments={${segments}} volume={${volume}} speed={${speed}} opacity={${opacity}} />\n</Clouds>`
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { Clouds, ${item} } from '@react-three/drei'\nimport { MeshBasicMaterial } from 'three'\n\n// Render a locally textured cloud within the shared provider.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 10] }}>\n    <Suspense fallback={null}><Clouds texture='/images/cloud-puff.svg' material={MeshBasicMaterial}>\n      <${item} seed={1} segments={24} bounds={[1.5, 0.5, 0.5]} volume={2.5} />\n    </Clouds></Suspense>\n  </Canvas></div>\n}`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={CloudDemo} Panel={CloudPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/staging/cloud' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/Cloud.tsx' />
}
