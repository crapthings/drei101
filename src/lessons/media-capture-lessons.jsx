import { useParams } from 'react-router'
import MediaCaptureDemo, { MediaCapturePanel } from '@/scenes/media-capture-lessons'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the matching screen or webcam capture component.
export default function MediaCaptureLesson () {
  const { name } = useParams()
  const screen = name === 'ScreenVideoTexture'
  const code = screen ? '<ScreenVideoTexture options={{ video: true, audio: false }} muted>{(texture) => <meshBasicMaterial map={texture} />}</ScreenVideoTexture>' : '<WebcamVideoTexture constraints={{ video: true, audio: false }} muted>{(texture) => <meshBasicMaterial map={texture} />}</WebcamVideoTexture>'
  const example = `import { Suspense, useState } from 'react'\nimport { Canvas } from '@react-three/fiber'\nimport { preload } from 'suspend-react'\nimport { ${name} } from '@react-three/drei'\n\n// Start the request directly in the click handler and share it with Drei.\nexport default function Example () {\n  const [started, setStarted] = useState(false)\n  const start = () => {\n    const request = navigator.mediaDevices.${screen ? 'getDisplayMedia({ video: true, audio: false })' : 'getUserMedia({ video: true, audio: false })'}\n    preload(() => request, [])\n    setStarted(true)\n  }\n  return <><button onClick={start} disabled={started}>Start</button><div style={{ height: 400 }}><Canvas camera={{ position: [0, 0, 6] }}><Suspense fallback={null}>{started && <${name} muted>{(texture) => <mesh><planeGeometry args={[4.8, 2.7]} /><meshBasicMaterial map={texture} /></mesh>}</${name}>}</Suspense></Canvas></div></>\n}`
  const liveCode = `import { preload } from 'suspend-react'\n\n// 在点击事件中发起请求，让屏幕捕获保留用户激活状态。\nconst request = navigator.mediaDevices.${screen ? 'getDisplayMedia({ video: true, audio: false })' : 'getUserMedia({ video: true, audio: false })'}\npreload(() => request, [])\n\n${code}`
  const source = `https://github.com/pmndrs/drei/blob/master/src/web/${name}.tsx`
  return <LessonLayout lessonKey='captureLesson' Demo={MediaCaptureDemo} Panel={MediaCapturePanel} minimalCode={example} liveCode={liveCode} docs={`https://drei.docs.pmnd.rs/loaders/${screen ? 'screen' : 'webcam'}-video-texture`} referenceUrl={source} />
}
