import { useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ComputedAttribute } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { BufferAttribute } from 'three'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The vertex shader forwards the computed geometry attribute to the fragment shader.
const vertexShader = 'attribute float weight; varying float vWeight; void main() { vWeight = weight; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'

// The fragment shader maps the computed value to the lesson palette.
const fragmentShader = 'varying float vWeight; void main() { gl_FragColor = vec4(mix(vec3(0.22, 0.25, 0.85), vec3(1.0, 0.55, 0.05), vWeight), 1.0); }'

// The store controls the boundary used when computing vertex attributes.
export const useComputedStore = create((set) => ({ boundary: 0, setBoundary: (boundary) => set({ boundary }), reset: () => set({ boundary: 0 }) }))

// The geometry computes a value for every vertex based on its horizontal position.
function AttributePlane () {
  const boundary = useComputedStore((state) => state.boundary)
  const compute = useCallback((geometry) => { const positions = geometry.attributes.position; const values = new Float32Array(positions.count); for (let i = 0; i < positions.count; i++) values[i] = positions.getX(i) >= boundary ? 1 : 0; return new BufferAttribute(values, 1) }, [boundary])
  return <mesh><planeGeometry args={[4, 2.5, 80, 1]}><ComputedAttribute key={boundary} name='weight' compute={compute} /></planeGeometry><shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} /></mesh>
}

// The canvas displays a plane colored from its computed vertex attribute.
export default function ComputedAttributeDemo () {
  const { t } = useTranslation()
  const reset = useComputedStore((state) => state.reset)
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('computedUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={2.4} minimumDistance={6} frontDepth={0} /><AttributePlane /></Canvas></div>
}

// The panel moves the threshold that drives attribute recomputation.
export function ComputedAttributePanel () {
  const { t } = useTranslation()
  const { boundary, setBoundary, reset } = useComputedStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('computedUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('computedUI.boundary')}</span><span className='font-mono'>{boundary} m</span></span><input type='range' min='-2' max='2' step='0.1' value={boundary} onChange={(event) => setBoundary(Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><p className='text-xs leading-6 text-slate-500'>{t('computedUI.hint')}</p></section>
}
