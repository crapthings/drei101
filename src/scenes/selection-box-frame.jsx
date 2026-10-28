import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Select } from '@react-three/drei'
import { SelectableCube } from '@/scenes/select-lessons'
import { ResponsiveFraming } from '@/scenes/responsive-framing'

// The isolated frame confines Drei's document-level Shift drag listeners to the demo.
export default function SelectionBoxFrame () {
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let dragging = false
    const start = (event) => {
      if (event.shiftKey && event.target instanceof HTMLCanvasElement) {
        dragging = true
        event.target.setPointerCapture(event.pointerId)
      }
    }
    const end = () => { dragging = false }
    const cancel = () => {
      if (dragging) {
        dragging = false
        setRevision((value) => value + 1)
        window.parent.postMessage({ type: 'drei-box-cancel' }, window.location.origin)
      }
    }
    document.addEventListener('pointerdown', start, true)
    document.addEventListener('pointerup', end, true)
    document.addEventListener('pointercancel', cancel, true)
    document.addEventListener('lostpointercapture', cancel, true)
    window.addEventListener('blur', cancel)
    return () => {
      document.removeEventListener('pointerdown', start, true)
      document.removeEventListener('pointerup', end, true)
      document.removeEventListener('pointercancel', cancel, true)
      document.removeEventListener('lostpointercapture', cancel, true)
      window.removeEventListener('blur', cancel)
    }
  }, [])
  const report = (items) => window.parent.postMessage({ type: 'drei-box-selection', names: items.map((item) => item.name).sort() }, window.location.origin)
  return <div className='h-screen w-screen overflow-hidden'><Canvas key={revision} camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}><ResponsiveFraming halfWidth={2.75} minimumDistance={8} frontDepth={0.5} /><color attach='background' args={['#eef2ff']} /><directionalLight position={[4, 6, 5]} intensity={3} /><Select box multiple border='1px solid #4f46e5' backgroundColor='rgba(99,102,241,0.15)' onChange={report} onChangePointerUp={report}>{['A', 'B', 'C'].map((name, index) => <SelectableCube key={name} name={name} position={[(index - 1) * 2, 0, 0]} />)}</Select></Canvas></div>
}
