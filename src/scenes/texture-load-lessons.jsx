import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Texture, useTexture } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store selects one of the two local images used by both loading APIs.
export const useTextureLoadStore = create((set) => ({ image: 'vector', setImage: (image) => set({ image }), reset: () => set({ image: 'vector' }) }))

// The surface displays the loaded texture without scene lighting or tone mapping.
function TextureSurface ({ texture }) {
  return <mesh><planeGeometry args={[4, 2.4]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
}

// The hook example resolves the image through Drei's texture cache.
function HookTexture ({ url }) {
  const texture = useTexture(url)
  return <TextureSurface texture={texture} />
}

// The component example passes the loaded texture through its render function.
function ComponentTexture ({ url }) {
  return <Texture input={url}>{(texture) => <TextureSurface texture={texture} />}</Texture>
}

// The canvas switches between real local images and the selected loading interface.
export default function TextureLoadDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { image, reset } = useTextureLoadStore()
  const url = `${import.meta.env.BASE_URL}images/${image === 'vector' ? 'vector-demo.svg' : 'crop-demo.svg'}`
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('textureLoadUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.5} minimumDistance={6} /><Suspense fallback={null}>{name === 'Texture' ? <ComponentTexture url={url} /> : <HookTexture url={url} />}</Suspense></Canvas></div>
}

// The panel chooses the source image and shows the corresponding local file.
export function TextureLoadPanel () {
  const { t } = useTranslation()
  const { image, setImage, reset } = useTextureLoadStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('textureLoadUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><p className='text-xs text-slate-600'>{t('textureLoadUI.source')}</p><div className='grid grid-cols-2 gap-2'>{['vector', 'crop'].map((choice) => <Button key={choice} aria-pressed={image === choice} onClick={() => setImage(choice)} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 ${image === choice ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{t(`textureLoadUI.${choice}`)}</Button>)}</div><p className='break-all rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-700'>/images/{image === 'vector' ? 'vector-demo.svg' : 'crop-demo.svg'}</p></section>
}
