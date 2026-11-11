import { useEffect, useState } from 'react';

const KEY = 'theme';
const query = '(prefers-color-scheme: dark)';

function readSaved() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null; // modo privado o almacenamiento bloqueado
  }
}

// Tema = elección manual guardada o, si no hay, el del sistema operativo.
export function useTheme() {
  const [choice, setChoice] = useState(readSaved); // 'light' | 'dark' | null (seguir al sistema)
  const [system, setSystem] = useState(() => (window.matchMedia(query).matches ? 'dark' : 'light'));

  // Si el usuario cambia el tema de su sistema, la app lo sigue (cuando no hay elección manual)
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setSystem(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // La elección manual se refleja en <html data-theme="…"> y se recuerda
  useEffect(() => {
    const root = document.documentElement;
    if (choice) root.dataset.theme = choice;
    else delete root.dataset.theme;
    try {
      if (choice) localStorage.setItem(KEY, choice);
      else localStorage.removeItem(KEY);
    } catch {
      /* sin persistencia: el toggle sigue funcionando en esta sesión */
    }
  }, [choice]);

  const theme = choice ?? system;
  const toggle = () => setChoice(theme === 'dark' ? 'light' : 'dark');

  return { theme, toggle };
}
