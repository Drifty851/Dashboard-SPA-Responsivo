import { navigate } from '../../router';
import Icon from '../ui/Icon';
import '../ui/Button.css';
import './Header.css';

export default function Header({ menuOpen, onMenuClick, menuButtonRef, theme, onToggleTheme }) {
  // La búsqueda global lleva a "Servidores" con el texto como filtro
  const handleSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q').trim();
    navigate('servidores', q ? { q } : undefined);
  };

  return (
    <header className="app__header header">
      <button
        ref={menuButtonRef}
        type="button"
        className="btn btn--ghost btn--icon header__menu"
        aria-label="Abrir menú de navegación"
        aria-controls="sidebar"
        aria-expanded={menuOpen}
        onClick={onMenuClick}
      >
        <Icon name="menu" size={22} />
      </button>

      <a href="#/dashboard" className="header__brand">
        <Icon name="cloud" size={22} />
        <span>CloudPanel</span>
      </a>

      <form className="header__search" role="search" onSubmit={handleSearch}>
        <Icon name="search" size={18} />
        <label htmlFor="buscar" className="visually-hidden">
          Buscar servidor
        </label>
        <input id="buscar" name="q" type="search" placeholder="Buscar servidor o IP…" />
      </form>

      <div className="header__actions">
        {/* Toggle manual del tema: aria-pressed indica si el modo oscuro está activo */}
        <button
          type="button"
          className="btn btn--ghost btn--icon theme-toggle"
          aria-label="Modo oscuro"
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          onClick={onToggleTheme}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button type="button" className="btn btn--ghost btn--icon" aria-label="Ver notificaciones">
          <Icon name="bell" />
        </button>
        <span className="avatar" role="img" aria-label="Perfil de Andrea Ruiz">
          AR
        </span>
      </div>
    </header>
  );
}
