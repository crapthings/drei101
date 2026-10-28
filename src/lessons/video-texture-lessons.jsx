import { useParams } from 'react-router'
import VideoTextureDemo, { VideoTexturePanel } from '@/scenes/video-texture-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the hook or component that turns video frames into a texture.
export default function VideoTextureLesson () {
  const { name } = useParams()
  const hook = name === 'useVideoTexture'
  const code = hook ? "const texture = useVideoTexture('/media/motion-demo.mp4', { start: false, muted: true, loop: true })\nreturn <mesh onClick={() => texture.image.play()}><planeGeometry args={[4.8, 2.7]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>" : "return <VideoTexture src='/media/motion-demo.mp4' start={false} muted loop>{texture => <mesh onClick={() => texture.image.play()}><planeGeometry args={[4.8, 2.7]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>}</VideoTexture>"
  const example = `import { Suspense } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { ${name} } from '@react-three/drei'\n\n// Click the screen to start the local silent video.\nfunction Screen () {\n  ${code.replaceAll('\n', '\n  ')}\n}\n\n// Suspend until the video metadata is available.\nexport default function Example () { return <div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Suspense fallback={null}><Screen /></Suspense></Canvas></div> }`
  return <LessonLayout lessonKey={`${name[0].toLowerCase()}${name.slice(1)}Lesson`} Demo={VideoTextureDemo} Panel={VideoTexturePanel} minimalCode={example} liveCode={code} docs='https://drei.docs.pmnd.rs/loaders/video-texture-use-video-texture' referenceUrl='https://github.com/pmndrs/drei/blob/master/src/core/VideoTexture.tsx' />
}
