// src/main.tsx
import React from 'react'; // AJOUTE CET IMPORT SI MANQUANT
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config.ts';
import { AuthProvider } from './contexts/AuthContext.tsx'; 

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);