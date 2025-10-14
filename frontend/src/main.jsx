import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ListingsProvider } from './context/ListingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ListingsProvider>
          <App />
        </ListingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
