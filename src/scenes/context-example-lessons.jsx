import { createContext, Suspense, useContext, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Example, OrbitControls, useContextBridge } from '@react-three/drei'
import { Button } from '@headlessui/react'
import { create } from 'zustand'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

// The context represents a presentation color provided outside the canvas.
const ColorContext = createContext('#6366f1')

// The store shares color and counter controls between the page and scene.
export const useContextExampleStore = create((set) => ({ color: '#6366f1', count: 0, revision: 0, setColor: (color) => set({ color }), change: (delta) => set((state) => ({ count: state.count + delta })), reset: () => set((state) => ({ color: '#6366f1', count: 0, revision: state.revision + 1 })) }))

// The consumer reads the bridged value inside the Three.js scene.
function ContextBox () {
  const color = useContext(ColorContext)
  return <mesh><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color={color} /></mesh>
}

// The bridge captures the outside context and reinstates it inside Canvas.
function ContextCanvas () {
  const Bridge = useContextBridge(ColorContext)
  return <Canvas camera={{ position: [4, 3, 6], fov: 45 }}><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, -3]} intensity={0.8} /><Bridge><ContextBox /></Bridge><OrbitControls makeDefault /></Canvas>
}

// The counter uses Example's imperative API to mirror the panel's value.
function ExampleCounter () {
  const example = useRef()
  const previous = useRef(0)
  const count = useContextExampleStore((state) => state.count)
  useEffect(() => { const difference = count - previous.current; if (difference > 0) example.current?.incr(difference); if (difference < 0) example.current?.decr(-difference); previous.current = count }, [count])
  return <Example ref={example} font={`${import.meta.env.BASE_URL}fonts/helvetiker_regular.typeface.json`} color='#6366f1' position={[0, 0.5, 0]} />
}

// The demo switches between the context bridge and Example counter scenes.
export default function ContextExampleDemo () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { color, revision, reset } = useContextExampleStore()
  useEffect(() => { reset(); return () => reset() }, [name, reset])
  return <div role='group' aria-label={t('contextExampleUI.scene')} className='h-[55vh] min-h-80 overflow-hidden rounded-2xl border border-indigo-100'>{name === 'useContextBridge' ? <ColorContext.Provider value={color}><ContextCanvas key={revision} /></ColorContext.Provider> : <Canvas key={revision} camera={{ position: [0, 1, 5], fov: 45 }}><color attach='background' args={['#eef2ff']} /><directionalLight position={[3, 5, 6]} intensity={3} /><directionalLight position={[-4, 2, -3]} intensity={0.8} /><Suspense fallback={null}><ExampleCounter /></Suspense><OrbitControls makeDefault /></Canvas>}</div>
}

// The panel changes the provided color or calls the counter through its ref.
export function ContextExamplePanel () {
  const { name } = useParams()
  const { t } = useTranslation()
  const { color, count, setColor, change, reset } = useContextExampleStore()
  return <section className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5'><div className='flex justify-between'><h3 className='text-xs font-medium'>{t('contextExampleUI.panel')}</h3><Button onClick={reset} className='cursor-pointer text-xs text-indigo-600'>{t('ui.reset')} ↺</Button></div>{name === 'useContextBridge' ? <><p className='text-xs text-slate-600'>{t('contextExampleUI.color')}: <span className='font-mono'>{color}</span></p><div className='grid grid-cols-2 gap-2'>{['#6366f1', '#f97316'].map((value) => <Button key={value} aria-pressed={color === value} onClick={() => setColor(value)} className='rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>{t(value === '#6366f1' ? 'contextExampleUI.indigo' : 'contextExampleUI.orange')}</Button>)}</div></> : <><p role='status' className='text-xs text-slate-600'>{t('contextExampleUI.count')}: {count}</p><div className='grid grid-cols-2 gap-2'><Button onClick={() => change(-1)} className='rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>− 1</Button><Button onClick={() => change(1)} className='rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700'>+ 1</Button></div></>}</section>
}
