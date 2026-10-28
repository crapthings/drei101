import SpatialAudioDemo, { SpatialAudioPanel, useSpatialAudioStore } from '@/scenes/positional-audio-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains how a positional sound follows a scene object and the camera listener.
export default function PositionalAudioLesson () {
  const { x, z } = useSpatialAudioStore()
  const code = `<group position={[${x}, 0, ${z}]}><PositionalAudio ref={sound} url='/media/spatial-tone.wav' distance={3} loop /></group>`
  const example = `import { Suspense, useRef } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { PositionalAudio } from '@react-three/drei'\n\n// Attach the sound to a visible source and start it on a click.\nfunction Source () {\n  const sound = useRef()\n  async function play () {\n    if (!sound.current) return\n    await sound.current.context.resume()\n    if (!sound.current.isPlaying) sound.current.play()\n  }\n  return <mesh onClick={play}><sphereGeometry args={[0.5, 32, 24]} /><meshBasicMaterial color='indigo' /><PositionalAudio ref={sound} url='/media/spatial-tone.wav' distance={3} loop /></mesh>\n}\n\n// The component attaches its listener to the active camera.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 9] }}><Suspense fallback={null}><Source /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey='positionalAudioLesson' Demo={SpatialAudioDemo} Panel={SpatialAudioPanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/abstractions/positional-audio' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/PositionalAudio.tsx' />
}
