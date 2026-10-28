import FaceLandmarkerDemo, { FaceLandmarkerPanel } from '@/scenes/face-landmarker-lessons'

// The isolated document owns the detector and its selected image until it is closed.
export default function FaceLandmarkerFrame () {
  return <div className='grid min-h-0 items-start gap-4 bg-indigo-50 p-4 md:grid-cols-[minmax(0,1fr)_260px]'><FaceLandmarkerDemo /><FaceLandmarkerPanel /></div>
}
