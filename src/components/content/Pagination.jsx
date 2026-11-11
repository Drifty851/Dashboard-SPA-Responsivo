import Icon from '../ui/Icon';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Paginación de servidores">
      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        <Icon name="chevrons-left" size={16} />
        Anterior
      </button>

      {/* Móvil: texto; tablet+: números de página */}
      <p className="pagination__status">
        Página {page} de {totalPages}
      </p>
      <ul role="list" className="pagination__pages">
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              className={`btn btn--icon ${p === page ? 'btn--primary' : 'btn--secondary'}`}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Página ${p}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Siguiente
        <Icon name="chevrons-left" size={16} className="icon--flip" />
      </button>
    </nav>
  );
}
