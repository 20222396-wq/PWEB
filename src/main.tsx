import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './App.css' 


const rootEl = document.getElementById('root');
if (rootEl) {
  rootEl.textContent = 'Cargando…';
  try {
    ReactDOM.createRoot(rootEl).render(
      <BrowserRouter basename={import.meta.env?.BASE_URL || '/PWEB/'}>
        <App />
      </BrowserRouter>
    );
  } catch (e) {
    console.error('Error montando la app:', e);
    rootEl.textContent = 'Error cargando la aplicación. Revisa la consola.';
  }
}