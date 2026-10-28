import ViewDemo, { ViewPanel, useViewStore } from '@/scenes/view-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains rendering multiple tracked regions through one canvas.
export default function ViewLesson () {
  const angle = useViewStore((state) => state.angle)
  const code = `<View className='view'><SceneOne angle={${angle}} /></View>\n<View className='view' index={2}><SceneTwo angle={${angle}} /></View>\n<Canvas><View.Port /></Canvas>`
  const example = `import { Canvas } from '@react-three/fiber'\nimport { View } from '@react-three/drei'\n\n// Render two independent regions using one shared canvas.\nexport default function Example () {\n  return <div style={{ position: 'relative', height: 400, display: 'flex' }}>\n    <View style={{ width: '50%', height: '100%' }}><mesh><boxGeometry /><meshNormalMaterial /></mesh></View>\n    <View index={2} style={{ width: '50%', height: '100%' }}><mesh><sphereGeometry /><meshNormalMaterial /></mesh></View>\n    <Canvas style={{ position: 'absolute', inset: 0 }}><View.Port /></Canvas>\n  </div>\n}`
  return <LessonLayout lessonKey='viewLesson' Demo={ViewDemo} Panel={ViewPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/portals/view' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/View.tsx' />
}
