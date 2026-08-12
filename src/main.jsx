import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './index.css'

// Pre-load critical fonts ASAP so canvas-based components (FuzzyText)
// can render with the correct font on first paint.
if (typeof document !== 'undefined' && document.fonts) {
  document.fonts.load('700 24px "Noto Serif SC"').catch(() => {})
  document.fonts.load('400 24px "Noto Serif SC"').catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
