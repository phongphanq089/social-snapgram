import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.scss'
import { BrowserRouter } from 'react-router-dom'
import QueriesProvider from './lib/react-query/QueriesProvider.tsx'
import { AuthProvider } from './components/AuthContext/index.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueriesProvider>
        <AuthProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueriesProvider>
    </BrowserRouter>
  </React.StrictMode>
)
