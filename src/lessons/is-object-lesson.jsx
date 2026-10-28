import IsObjectDemo, { IsObjectPanel, objectExampleCode, useIsObjectStore } from '@/scenes/is-object-lesson'
import { LessonLayout } from '@/lessons/lesson-layout'

// The lesson explains the predicate used to distinguish keyed texture input.
export default function IsObjectLesson () {
  const { selected } = useIsObjectStore()
  const code = `IsObject(${objectExampleCode[selected]})`
  const example = `import { IsObject } from '@react-three/drei'\n\n// Compare the forms accepted by the texture loading helper.\nconsole.log(IsObject({ map: '/image.svg' })) // true\nconsole.log(IsObject(['/image.svg'])) // false\nconsole.log(IsObject('/image.svg')) // false`
  const source = 'https://github.com/pmndrs/drei/blob/master/src/core/Texture.tsx'
  return <LessonLayout lessonKey='isObjectLesson' Demo={IsObjectDemo} Panel={IsObjectPanel} minimalCode={example} liveCode={code} docs={source} referenceUrl={source} />
}
