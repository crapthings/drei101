import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Instance, InstancedAttribute, Instances } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The shader reads one custom heat value per instance and maps it to a color.
const vertexShader = 'attribute float heat; varying float vHeat; void main() { vHeat = heat; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }'
// The fragment shader interpolates the palette using the instance value.
const fragmentShader = 'varying float vHeat; void main() { vec3 cold = vec3(0.22, 0.25, 0.85); vec3 hot = vec3(1.0, 0.55, 0.05); gl_FragColor = vec4(mix(cold, hot, clamp(vHeat, 0.0, 1.0)), 1.0); }'

// The store controls the custom attribute offset and reports actual draw calls.
export const useAttributeStore = create((set) => ({ offset: 0, calls: 0, setOffset: (offset) => set({ offset }), reportCalls: (calls) => set((state) => state.calls === calls ? state : { calls }), reset: () => set({ offset: 0, calls: 0 }) }))

// The reporter samples the renderer's completed-frame draw count.
function DrawCallReporter () {
  const last = useRef(0)
  const reportCalls = useAttributeStore((state) => state.reportCalls)
  useFrame(({ gl, clock }) => { if (clock.elapsedTime - last.current > 0.5) { last.current = clock.elapsedTime; reportCalls(gl.info.render.calls) } }, -1)
  return null
}

// The canvas supplies per-instance heat values to a custom shader through InstancedAttribute.
export default function InstancedAttributeDemo () {
  const { t } = useTranslation()
  const { offset, reset } = useAttributeStore()
  useEffect(() => { reset(); return () => reset() }, [reset])
  return <div role='group' aria-label={t('attributeUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'><Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}><color attach='background' args={['#eef2ff']} /><ResponsiveFraming halfWidth={3} minimumDistance={7} frontDepth={0} /><DrawCallReporter /><Instances limit={20}><planeGeometry args={[0.42, 0.42]} /><shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} /><InstancedAttribute name='heat' defaultValue={0} />{Array.from({ length: 20 }, (_, index) => <Instance key={index} position={[(index % 10 - 4.5) * 0.52, (Math.floor(index / 10) - 0.5) * 0.6, 0]} heat={Math.min(1, Math.max(0, index / 19 + offset))} />)}</Instances></Canvas></div>
}

// The panel shifts the per-instance values and reports the resulting draw count.
export function InstancedAttributePanel () {
  const { t } = useTranslation()
  const { offset, calls, setOffset, reset } = useAttributeStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex items-center justify-between'><h3 className='text-xs font-medium'>{t('attributeUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600 focus-visible:outline-2'>{t('ui.reset')} ↺</Button></div><label className='block space-y-3 text-xs text-slate-600'><span className='flex justify-between'><span>{t('attributeUI.offset')}</span><span className='font-mono'>{offset}</span></span><input type='range' min='-1' max='1' step='0.05' value={offset} onChange={(event) => setOffset(Number(event.target.value))} className='w-full accent-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500' /></label><p className='rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700'>{t('attributeUI.calls')}: <span className='font-mono'>{calls}</span></p><p className='text-xs leading-6 text-slate-500'>{t('attributeUI.hint')}</p></section>
}
