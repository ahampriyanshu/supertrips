import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App.jsx'

posthog.init('phc_6MEVCBynqZYzc8RgyHr1p3AVpYPans0JfApPtnOcw8x', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2025-11-30',
  person_profiles: 'always',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
