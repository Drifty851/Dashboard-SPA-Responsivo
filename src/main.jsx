import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Orden importante: primero variables, luego base y al final el layout
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';

import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
