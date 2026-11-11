import { useCallback, useEffect, useRef, useState } from 'react';
import { ServersProvider, useServers } from './context/ServersContext';
import { ROUTES, useHashRoute } from './router';
import { useTheme } from './hooks/useTheme';

// Zona 1 — Navegación
import Header from './components/navigation/Header';
import Sidebar from './components/navigation/Sidebar';
import Breadcrumbs from './components/navigation/Breadcrumbs';
// Zona 2 — Contenido dinámico
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Settings from './pages/Settings';
// Zona 3 — Interacción y acciones críticas
import ConfigPanel from './components/interaction/ConfigPanel';
import ConfirmDialog from './components/interaction/ConfirmDialog';
import Toast from './components/interaction/Toast';

export default function App() {
  return (
    <ServersProvider>
      <Shell />
    </ServersProvider>
  );
}

function Shell() {
  const route = useHashRoute();
  const page = route.path;
  const { dispatch } = useServers();
  const { theme, toggle: toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [configTarget, setConfigTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const mainRef = useRef(null);
  const menuButtonRef = useRef(null);
  const isFirstRender = useRef(true);

  const notify = useCallback((text) => setToast({ id: Date.now(), text }), []);
  const clearToast = useCallback(() => setToast(null), []);

  // Al cambiar de página: título de la pestaña, cerrar menú y llevar el foco al contenido
  useEffect(() => {
    document.title = `${ROUTES[page].title} · CloudPanel`;
    setMenuOpen(false);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // La nueva página empieza arriba; el foco va al contenido sin provocar scroll
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [page]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Escape cierra el menú móvil
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeMenu();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  const saveConfig = (data) => {
    dispatch({ type: 'UPDATE_SERVER', server: data });
    setConfigTarget(null);
    notify(`Cambios guardados en ${data.name}.`);
  };

  const confirmDelete = (server) => {
    dispatch({ type: 'DELETE_SERVER', id: server.id });
    setDeleteTarget(null);
    notify(`Servidor ${server.name} eliminado.`);
  };

  const pages = {
    dashboard: <Dashboard />,
    servidores: (
      <Servers query={route.query.get('q') ?? ''} onConfigure={setConfigTarget} onDelete={setDeleteTarget} />
    ),
    configuracion: <Settings onSaved={notify} />,
  };

  return (
    <div className={`app${collapsed ? ' app--collapsed' : ''}`}>
      <a
        href="#contenido"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Saltar al contenido
      </a>

      {/* ZONA 1 — Navegación */}
      <Header
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen(true)}
        menuButtonRef={menuButtonRef}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Sidebar
        active={page}
        open={menuOpen}
        collapsed={collapsed}
        onClose={closeMenu}
        onNavigate={() => setMenuOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div className={`app__scrim${menuOpen ? ' is-visible' : ''}`} onClick={closeMenu} aria-hidden="true" />

      {/* ZONA 2 — Contenido dinámico */}
      <main id="contenido" ref={mainRef} className="app__main" tabIndex={-1}>
        <Breadcrumbs page={page} />
        {pages[page]}
      </main>

      {/* ZONA 3 — Interacción y acciones críticas */}
      <ConfigPanel server={configTarget} onClose={() => setConfigTarget(null)} onSave={saveConfig} />
      <ConfirmDialog server={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
