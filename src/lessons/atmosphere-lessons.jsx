import { useParams } from 'react-router'
import AtmosphereDemo, { AtmospherePanel, useAtmosphereStore } from '@/scenes/atmosphere-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson shows a runnable example and current sky or particle settings.
export default function AtmosphereLesson () {
  const { name } = useParams()
  const { inclination, azimuth, turbidity, count, size, speed } = useAtmosphereStore()
  const isSky = name === 'Sky' || name === 'calcPosFromAngles'
  const code = isSky ? `const sun = calcPosFromAngles(${inclination}, ${azimuth})\n<Sky distance={100} sunPosition={sun} turbidity={${turbidity}} />` : name === 'Stars' ? `<Stars radius={40} depth={25} count={${count}} factor={${size}} saturation={0.25} fade speed={${speed}} />` : `<Sparkles key={${Math.round(count / 10)}} count={${Math.round(count / 10)}} scale={[6, 4, 4]} size={${size}} speed={${speed}} color='#c7d2fe' />`
  const imports = isSky ? 'Sky, calcPosFromAngles' : name
  const content = isSky ? `const sun = calcPosFromAngles(0.55, 0.25)\n  return <Sky distance={100} sunPosition={sun} />` : `return ${code}`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { ${imports} } from '@react-three/drei'\n\n// Render the sky or particle field inside the canvas.\nfunction Scene () {\n  ${content}\n}\n\n// Provide the camera and drawing surface.\nexport default function Example () {\n  return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 1, 8], far: 300 }}>\n    <Scene />\n  </Canvas></div>\n}`
  const source = name === 'calcPosFromAngles' ? 'Sky' : name
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={AtmosphereDemo} Panel={AtmospherePanel} minimalCode={example} liveCode={code} docs={`https://drei.docs.pmnd.rs/staging/${source.toLowerCase()}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${source}.tsx`} />
}
