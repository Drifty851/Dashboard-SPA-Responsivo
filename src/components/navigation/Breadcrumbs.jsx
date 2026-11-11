import { ROUTES, href } from '../../router';
import './Breadcrumbs.css';

// Responde "¿Dónde estoy?" y "¿De dónde vengo?": Inicio / Página actual
export default function Breadcrumbs({ page }) {
  const items = [{ label: 'Inicio', to: href('dashboard') }, { label: ROUTES[page].title }];

  return (
    <nav aria-label="Ruta de navegación" className="breadcrumbs">
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label}>
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.to}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
