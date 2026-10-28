import UseAnimationsDemo, { UseAnimationsPanel, useAnimationStore } from '@/scenes/use-animations'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson connects clip selection to Drei's animation mixer and actions.
export default function UseAnimationsLesson () {
  const { clip, playing, speed } = useAnimationStore()
  const minimal = `import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAnimations } from '@react-three/drei'
import { AnimationClip, NumberKeyframeTrack } from 'three'

// Define a reusable two-second animation clip.
const clips = [new AnimationClip('Bounce', 2, [new NumberKeyframeTrack('.position[y]', [0, 1, 2], [0, 1, 0])])]

// Bind the clip to a model and play it after mounting.
function Model () {
  const root = useRef()
  const { actions } = useAnimations(clips, root)
  useEffect(() => { const action = actions.Bounce; action.reset().play(); return () => action.stop() }, [actions])
  return <mesh ref={root}><boxGeometry /><meshStandardMaterial color='indigo' /></mesh>
}

// Render the animated model.
export default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 8] }}><directionalLight position={[3, 5, 5]} intensity={3} /><Model /></Canvas></div> }`
  const live = `const { actions, mixer } = useAnimations(clips, root)
// Switch actions with a short crossfade.
const action = actions.${clip}
action.reset().fadeIn(0.2).play()
// Pause or change playback speed through the mixer.
mixer.timeScale = ${playing ? speed : 0}`
  return <LessonLayout lessonKey='useAnimationsLesson' Demo={UseAnimationsDemo} Panel={UseAnimationsPanel} minimalCode={minimal} liveCode={live} docs='https://drei.docs.pmnd.rs/abstractions/use-animations' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/useAnimations.tsx' />
}
