import { useParams } from 'react-router'
import LayoutDemo, { LayoutPanel, useLayoutStore } from '@/scenes/layout-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson presents a runnable example and current settings for each layout helper.
export default function LayoutLesson () {
  const { name } = useParams()
  const { width, height, anchorX, anchorY, enabled } = useLayoutStore()
  const child = '<mesh><boxGeometry args={[2, 1, 0.7]} /><meshStandardMaterial color="indigo" /></mesh>'
  const content = name === 'BBAnchor' ? `<mesh><boxGeometry args={[2, 1, 0.7]} /><meshStandardMaterial color="indigo" /><BBAnchor anchor={[1, 1, 1]}><mesh><sphereGeometry args={[0.1]} /><meshBasicMaterial color="orange" /></mesh></BBAnchor></mesh>` : `<${name}>${child}</${name}>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Render a model with the selected layout helper.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}>\n    <directionalLight position={[3, 5, 5]} intensity={3} />\n    ${content}\n  </Canvas></div>\n}`
  const liveCode = name === 'BBAnchor' ? `<group>\n  <Model width={${width.toFixed(1)}} height={${height.toFixed(1)}} />\n  <BBAnchor anchor={[${anchorX.toFixed(1)}, ${anchorY.toFixed(1)}, 1]}><Marker /></BBAnchor>\n</group>` : name === 'Center' ? `<Center disable={${!enabled}} cacheKey="${width}-${height}">\n  <Model width={${width.toFixed(1)}} height={${height.toFixed(1)}} offset />\n</Center>` : enabled ? `<Resize key="${width}-${height}">\n  <Model width={${width.toFixed(1)}} height={${height.toFixed(1)}} />\n</Resize>` : `<Model width={${width.toFixed(1)}} height={${height.toFixed(1)}} />`
  const slug = name === 'BBAnchor' ? 'bb-anchor' : name.toLowerCase()
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={LayoutDemo} Panel={LayoutPanel} minimalCode={example} liveCode={liveCode} docs={`https://drei.docs.pmnd.rs/staging/${slug}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${name}.tsx`} />
}
