import { useEffect, useRef } from 'react';
import { ROUTES, href } from '../../router';
import Icon from '../ui/Icon';
import './Sidebar.css';

// "¿A dónde puedo ir?": todas las secciones visibles.
// "¿Dónde estoy?": la sección actual marcada con aria-current="page".
export default function Sidebar({ active, open, collapsed, onClose, onNavigate, onToggleCollapse }) {
  const closeRef = useRef(null);

  // Al abrirse en móvil, el foco pasa al botón "Cerrar"
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <aside id="sidebar" className={`app__sidebar sidebar${open ? ' is-open' : ''}`} aria-label="Menú lateral">
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <Icon name="cloud" size={24} />
          <span className="sidebar__label">CloudPanel</span>
        </div>
        <button
          ref={closeRef}
          type="button"
          className="btn btn--ghost btn--icon sidebar__close"
          onClick={onClose}
          aria-label="Cerrar menú de navegación"
        >
          <Icon name="x" />
        </button>
      </div>

      <nav aria-label="Navegación principal">
        <ul role="list" className="sidebar__list">
          {Object.entries(ROUTES).map(([id, route]) => (
            <li key={id}>
              <a
                href={href(id)}
                className="sidebar__link"
                aria-current={id === active ? 'page' : undefined}
                title={collapsed ? route.title : undefined}
                onClick={onNavigate}
              >
                <Icon name={route.icon} />
                <span className="sidebar__label">{route.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="sidebar__link sidebar__collapse"
        onClick={onToggleCollapse}
        aria-controls="sidebar"
        aria-expanded={!collapsed}
        title={collapsed ? 'Expandir menú' : undefined}
      >
        <Icon name="chevrons-left" />
        <span className="sidebar__label">{collapsed ? 'Expandir menú' : 'Colapsar menú'}</span>
      </button>
    </aside>
  );
}
