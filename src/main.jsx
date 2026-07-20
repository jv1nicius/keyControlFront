import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./contexts/AuthContext.jsx"
import AppThemeProvider from './layouts/theme/AppThemeProvider.jsx'
import App from './App.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <AppThemeProvider>
            <App />
        </AppThemeProvider>
    </AuthProvider>
)