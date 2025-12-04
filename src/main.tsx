import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './App.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <BrowserRouter basename='/PWEB'>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)