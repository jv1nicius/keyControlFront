import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./contexts/AuthContext.jsx"
import AppThemeProvider from './layouts/theme/AppThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <AppThemeProvider>
            <App />
        </AppThemeProvider>
    </AuthProvider>
)
