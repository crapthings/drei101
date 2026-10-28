import PresentationDemo, { PresentationPanel, usePresentationStore } from '@/scenes/presentation-controls'
import { LessonLayout } from '@/lessons/lesson-layout'

// The standalone example rotates a marked one-meter cube with constrained dragging.
const example = `import { Canvas } from '@react-three/fiber'
import { PresentationControls } from '@react-three/drei'

// Drag the object and let it return to its initial orientation.
export default function Example () {
  return <div>
    <p>Drag the cube and release it to see it spring back.</p>
    <div className='h-[400px]'><Canvas>
      <PresentationControls snap cursor={false} polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
        <group>
          <mesh><boxGeometry /><meshNormalMaterial /></mesh>
          <mesh position={[0.2, 0.2, 0.51]}><boxGeometry args={[0.2, 0.2, 0.04]} /><meshBasicMaterial color='#f59e0b' /></mesh>
        </group>
      </PresentationControls>
    </Canvas></div>
  </div>
}`

// The lesson explains object rotation and displays the current control settings.
export default function PresentationLesson () {
  const snap = usePresentationStore((state) => state.snap)
  const limited = usePresentationStore((state) => state.limited)
  const tilted = usePresentationStore((state) => state.tilted)
  const revision = usePresentationStore((state) => state.revision)
  const limit = limited ? 'Math.PI / 4' : 'Math.PI'
  const liveCode = `// Remount when the initial tilt or reset changes.\n<PresentationControls\n  key='${revision}-${tilted}'\n  snap={${snap}}\n  rotation={[0, 0, ${tilted ? 'Math.PI / 6' : '0'}]}\n  polar={[-${limit}, ${limit}]}\n  azimuth={[-${limit}, ${limit}]}\n  cursor={false}\n>\n  <PresentedObject />\n</PresentationControls>`
  return <LessonLayout lessonKey='presentationControlsLesson' Demo={PresentationDemo} Panel={PresentationPanel} minimalCode={example} liveCode={liveCode} docs='https://drei.docs.pmnd.rs/controls/presentation-controls' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/web/PresentationControls.tsx' />
}
