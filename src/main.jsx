import 'three-hex-tiling'
import '@/i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app'
import '@/styles.css'

createRoot(document.getElementById('root')).render(
  (window.location.hash.startsWith('#/capture-') || window.location.hash === '#/face-detector' || window.location.hash === '#/face-live') ? <App /> : <StrictMode>
    <App />
  </StrictMode>
)
