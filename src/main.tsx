// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ModeProvider } from './contexts/ModeContext'

// Use BASE_URL from Vite (set VITE_BASE for GH Pages).
const basename = import.meta.env.BASE_URL || '/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ModeProvider>
        <App />
      </ModeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)