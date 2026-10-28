import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Edges, MeshDiscardMaterial, MultiMaterial, OrbitControls } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The store controls the discard switch and wireframe layer opacity.
export const useMaterialLayersStore = create((set) => ({ enabled: true, opacity: 0.8, setValue: (key, value) => set({ [key]: value }), reset: () => set({ enabled: true, opacity: 0.8 }) }))

// The shadow scene keeps a hidden caster and its edge child active for comparison.
function DiscardScene () {
  const enabled = useMaterialLayersStore((state) => state.enabled)
  return <><color attach='background' args={['#eef2ff']} /><directionalLight castShadow position={[3, 7, 5]} intensity={3} shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0005} /><directionalLight position={[-4, 3, -2]} intensity={0.8} /><mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.02, 0]}><planeGeometry args={[10, 8]} /><meshStandardMaterial color='#ffffff' /></mesh>{[-1.7, 1.7].map((x, index) => <mesh key={x} castShadow position={[x, 1.2, 0]} rotation={[0.25, 0.35, 0]}><boxGeometry args={[1.3, 1.3, 1.3]} />{index === 1 && enabled ? <MeshDiscardMaterial /> : <meshStandardMaterial color={index ? '#6366f1' : '#a5b4fc'} />}<Edges color='#312e81' /></mesh>)}<OrbitControls makeDefault target={[0, 0.7, 0]} minDistance={5} maxDistance={18} maxPolarAngle={Math.PI / 2 - 0.03} /></>
}

// The layered scene compares one material with two passes over the same geometry.
function MultiScene () {
  const { enabled, opacity } = useMaterialLayersStore()
  return <><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3.7} minimumDistance={9} frontDepth={1.2} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-3, 2, 4]} intensity={0.8} /><mesh position={[-1.7, 0, 0]} rotation={[0.25, 0.35, 0]}><icosahedronGeometry args={[1.2, 1]} /><meshStandardMaterial color='#818cf8' roughness={0.5} /></mesh><mesh position={[1.7, 0, 0]} rotation={[0.25, 0.35, 0]}><icosahedronGeometry args={[1.2, 1]} />{enabled ? <MultiMaterial><meshStandardMaterial color='#818cf8' roughness={0.5} /><meshBasicMaterial color='#fbbf24' wireframe transparent opacity={opacity} /></MultiMaterial> : <meshStandardMaterial color='#818cf8' roughness={0.5} />}</mesh></>
}

// The canvas chooses a shadow or material-layer comparison and resets on navigation.
export default function MaterialLayersDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const reset = useMaterialLayersStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('materialLayersUI.scene', { name })} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas shadows camera={{ position: name === 'MeshDiscardMaterial' ? [5, 5, 10] : [0, 0, 9], fov: 45 }} dpr={[1, 2]}>{name === 'MeshDiscardMaterial' ? <DiscardScene /> : <MultiScene />}</Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('materialLayersUI.reference')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('materialLayersUI.effect')}</span></div></div>
}

// The panel toggles the effect and adjusts overlay opacity where applicable.
export function MaterialLayersPanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const state = useMaterialLayersStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('materialLayersUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div>{name === 'MultiMaterial' && <label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('materialLayersUI.opacity')}</span><span className='font-mono'>{state.opacity}</span></span><input type='range' min='0' max='1' step='0.05' value={state.opacity} onChange={(event) => state.setValue('opacity', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label>}<Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'materialLayersUI.on' : 'materialLayersUI.off')}</Button>{name === 'MeshDiscardMaterial' && <p className='text-xs leading-6 text-slate-500'>{t('materialLayersUI.orbit')}</p>}</section>
}
