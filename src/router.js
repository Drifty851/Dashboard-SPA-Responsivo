import { useEffect, useState } from 'react';

// Router mínimo basado en el hash de la URL: …/#/servidores?q=web
// No necesita librerías y el botón "Atrás" del navegador funciona solo.
export const ROUTES = {
  dashboard: { title: 'Dashboard', icon: 'dashboard' },
  servidores: { title: 'Servidores', icon: 'server' },
  configuracion: { title: 'Configuración', icon: 'settings' },
};

export const DEFAULT_ROUTE = 'dashboard';

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path = '', qs = ''] = raw.split('?');
  return {
    path: ROUTES[path] ? path : DEFAULT_ROUTE,
    query: new URLSearchParams(qs),
  };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function href(path, params) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  return `#/${path}${qs}`;
}

export function navigate(path, params) {
  window.location.hash = href(path, params).slice(1);
}
