import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EnvironmentMap, useBoxProjectedEnv, useEnvironment } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The local cube images provide identifiable reflected panels for the projection comparison.
const files = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map((face) => `${import.meta.env.BASE_URL}images/environment/${face}.svg`)

// The store controls the virtual projection box and its correction switch.
export const useBoxProjectionStore = create((set) => ({ boxSize: 6, enabled: true, setValue: (key, value) => set({ [key]: value }), reset: () => set({ boxSize: 6, enabled: true }) }))

// The material applies Drei's hook and adapts its shader insertion points to Three.js r186.
function ProjectedMaterial ({ texture }) {
  const size = useBoxProjectionStore((state) => state.boxSize)
  const projection = useBoxProjectedEnv([0, 0, 0], [size, 4, 5])
  const compile = (shader) => {
    projection.onBeforeCompile(shader)
    shader.fragmentShader = shader.fragmentShader.replace('vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );', 'vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n#ifdef BOX_PROJECTED_ENV_MAP\nworldNormal = parallaxCorrectNormal(worldNormal, envMapSize, envMapPosition);\n#endif')
      .replace('reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );', 'reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\n#ifdef BOX_PROJECTED_ENV_MAP\nreflectVec = parallaxCorrectNormal(reflectVec, envMapSize, envMapPosition);\n#endif')
  }
  return <meshStandardMaterial {...projection} onBeforeCompile={compile} envMap={texture} metalness={1} roughness={0.08} />
}

// The two reflective spheres compare standard environment mapping with box projection.
function ProjectionScene () {
  const texture = useEnvironment({ files })
  const enabled = useBoxProjectionStore((state) => state.enabled)
  return <><color attach='background' args={['#e0e7ff']} /><ResponsiveFraming halfWidth={3.3} minimumDistance={8} frontDepth={1.25} /><EnvironmentMap map={texture} /><mesh position={[-1.8, 0, 0]}><sphereGeometry args={[1.25, 48, 32]} /><meshStandardMaterial envMap={texture} metalness={1} roughness={0.08} /></mesh><mesh position={[1.8, 0, 0]}><sphereGeometry args={[1.25, 48, 32]} />{enabled ? <ProjectedMaterial texture={texture} /> : <meshStandardMaterial envMap={texture} metalness={1} roughness={0.08} />}</mesh></>
}

// The canvas resets the box-projection comparison on entry and exit.
export default function BoxProjectionDemo () {
  const { t } = useTranslation()
  const reset = useBoxProjectionStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('boxProjectionUI.scene')} className='relative h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><Suspense fallback={null}><ProjectionScene /></Suspense></Canvas><div className='pointer-events-none absolute inset-x-4 top-4 flex justify-between gap-2 text-xs text-indigo-700'><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('boxProjectionUI.normal')}</span><span className='rounded-full bg-white/90 px-3 py-1.5'>{t('boxProjectionUI.projected')}</span></div></div>
}

// The panel changes the projection box width and toggles the corrected material.
export function BoxProjectionPanel () {
  const { t } = useTranslation()
  const state = useBoxProjectionStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('boxProjectionUI.panel')}</h3><Button onClick={state.reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('boxProjectionUI.boxSize')}</span><span className='font-mono'>{state.boxSize.toFixed(1)} m</span></span><input type='range' min='4' max='12' step='0.5' value={state.boxSize} onChange={(event) => state.setValue('boxSize', Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><Button aria-pressed={state.enabled} onClick={() => state.setValue('enabled', !state.enabled)} className='w-full cursor-pointer rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500'>{t(state.enabled ? 'boxProjectionUI.on' : 'boxProjectionUI.off')}</Button><p className='text-xs leading-6 text-slate-500'>{t('boxProjectionUI.hint')}</p></section>
}
