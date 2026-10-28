import { useParams } from 'react-router'
import SpriteDemo, { SpritePanel, useSpriteLessonStore } from '@/scenes/sprite-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson presents sprite loading, playback, context and frame utilities.
export default function SpriteLesson () {
  const { name } = useParams()
  const { playing, fps, offset, opaque, grouped } = useSpriteLessonStore()
  const sheet = "'/images/sprite-demo.svg'"
  const examples = {
    checkIfFrameIsEmpty: `import { checkIfFrameIsEmpty } from '@react-three/drei'\n\n// Test an RGBA pixel buffer by its alpha channel.\nexport default function Example () {\n  const pixels = new Uint8ClampedArray([255, 255, 255, 0])\n  return <p>{String(checkIfFrameIsEmpty(pixels))}</p>\n}`,
    getFirstFrame: `import { getFirstFrame } from '@react-three/drei'\n\n// Read the first frame from an array or a named group.\nexport default function Example () {\n  const frame = { frame: { x: 0, y: 0, w: 128, h: 128 } }\n  const first = getFirstFrame({ motion: [frame] }, 'motion')\n  return <p>{JSON.stringify(first.frame)}</p>\n}`,
    useSpriteLoader: `import { Canvas } from '@react-three/fiber'\nimport { useSpriteLoader, SpriteAnimator } from '@react-three/drei'\n\n// Load four equal-sized frames and pass the parsed dataset to an animator.\nfunction Scene () {\n  const { spriteObj } = useSpriteLoader(${sheet}, null, null, 4)\n  return spriteObj && <SpriteAnimator spriteDataset={spriteObj} numberOfFrames={4} fps={4} loop autoPlay roundFramePosition />\n}\n\n// Render the animated sprite in a canvas.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><Scene /></Canvas></div> }`,
    SpriteAnimator: `import { Canvas } from '@react-three/fiber'\nimport { useSpriteLoader, SpriteAnimator } from '@react-three/drei'\n\n// Render a looping animation from a locally loaded sheet.\nfunction Scene () {\n  const { spriteObj } = useSpriteLoader(${sheet}, null, null, 4)\n  return spriteObj && <SpriteAnimator spriteDataset={spriteObj} numberOfFrames={4} fps={4} loop autoPlay roundFramePosition />\n}\n\n// Provide a canvas for playback.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><Scene /></Canvas></div> }`,
    useSpriteAnimator: `import { Canvas, useFrame } from '@react-three/fiber'\nimport { useSpriteLoader, SpriteAnimator, useSpriteAnimator } from '@react-three/drei'\n\n// Drive the animator context from a normalized position.\nfunction Control () {\n  const animator = useSpriteAnimator()\n  useFrame(() => { if (animator) animator.current = 0.5 })\n  return null\n}\n\n// Provide the animator context to the control.\nfunction Scene () {\n  const { spriteObj } = useSpriteLoader(${sheet}, null, null, 4)\n  return spriteObj && <SpriteAnimator spriteDataset={spriteObj} numberOfFrames={4} loop autoPlay><Control /></SpriteAnimator>\n}\n\n// Render the sprite.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 7] }}><Scene /></Canvas></div> }`
  }
  const codes = {
    checkIfFrameIsEmpty: `const pixels = new Uint8ClampedArray([255, 255, 255, ${opaque ? 255 : 0}])\nconst empty = checkIfFrameIsEmpty(pixels)`,
    getFirstFrame: `const first = getFirstFrame(${grouped ? '{ motion: frames }, \'motion\'' : 'frames'})\n// first.frame contains x, y, width and height.`,
    useSpriteLoader: `const { spriteObj } = useSpriteLoader(${sheet}, null, null, 4)\n<SpriteAnimator spriteDataset={spriteObj} numberOfFrames={4} fps={${fps}} loop autoPlay pause={${!playing}} />`,
    SpriteAnimator: `<SpriteAnimator spriteDataset={spriteObj} numberOfFrames={4} fps={${fps}} loop autoPlay pause={${!playing}} roundFramePosition />`,
    useSpriteAnimator: `const animator = useSpriteAnimator()\nuseFrame(() => { if (animator) animator.current = ${offset.toFixed(2)} })\n// This child runs inside <SpriteAnimator>.`
  }
  const docs = name === 'SpriteAnimator' || name === 'useSpriteAnimator' ? 'misc/sprite-animator' : 'loaders/use-sprite-loader'
  const source = name === 'SpriteAnimator' || name === 'useSpriteAnimator' ? 'SpriteAnimator' : 'useSpriteLoader'
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={SpriteDemo} Panel={SpritePanel} minimalCode={examples[name]} liveCode={codes[name]} docs={`https://drei.docs.pmnd.rs/${docs}`} referenceUrl={`https://github.com/pmndrs/drei/blob/master/src/core/${source}.tsx`} />
}
