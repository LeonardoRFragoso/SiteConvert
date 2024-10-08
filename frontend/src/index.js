import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext'; // Importando o ThemeProvider para controle de tema

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider> {/* Envolvendo a aplicação com o provedor de tema */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Medição de performance (opcional)
reportWebVitals();
