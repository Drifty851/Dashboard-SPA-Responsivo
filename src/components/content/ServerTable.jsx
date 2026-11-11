import { useEffect, useMemo, useState } from 'react';
import { REGIONS, STATUS_LABEL, statusOf } from '../../data/servers';
import Control from '../ui/Control';
import Icon from '../ui/Icon';
import Pagination from './Pagination';
import '../ui/Button.css';
import '../ui/Form.css';
import './ServerTable.css';

const PAGE_SIZE = 6;
const SEARCH_DEBOUNCE_MS = 350;

function StatusBadge({ status }) {
  // Texto + color: el estado nunca depende solo del color
  return (
    <span className={`badge badge--${status}`}>
      <span className="badge__dot" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function Meter({ value, threshold }) {
  const level = value >= threshold ? 'danger' : value >= 70 ? 'warning' : 'ok';
  return (
    <span className="meter">
      <span className="meter__track" aria-hidden="true">
        <span className="meter__fill" data-level={level} style={{ '--value': `${value}%` }} />
      </span>
      <span className="meter__value">{value} %</span>
    </span>
  );
}

export default function ServerTable({ servers, threshold, compact = false, initialQuery = '', onConfigure, onDelete }) {
  const [query, setQuery] = useState(initialQuery);
  // Debounce: el filtro se aplica 350 ms después de la última tecla.
  // Mientras tanto el campo está en estado Loading.
  const [appliedQuery, setAppliedQuery] = useState(initialQuery);
  const searching = query !== appliedQuery;
  const [status, setStatus] = useState('todos');
  const [region, setRegion] = useState('todas');
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () => servers.map((s) => ({ ...s, status: statusOf(s, threshold) })),
    [servers, threshold]
  );

  useEffect(() => {
    if (query === appliedQuery) return undefined;
    const t = setTimeout(() => {
      setAppliedQuery(query);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, appliedQuery]);

  // Modo compacto (Dashboard): los 5 con más CPU, sin filtros ni acciones
  const q = appliedQuery.trim().toLowerCase();
  const filtered = compact
    ? [...rows].sort((a, b) => b.cpu - a.cpu).slice(0, 5)
    : rows.filter(
        (s) =>
          (!q || s.name.includes(q) || s.ip.includes(q)) &&
          (status === 'todos' || s.status === status) &&
          (region === 'todas' || s.region === region)
      );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = compact ? filtered : filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(current * PAGE_SIZE, filtered.length);
  const hasFilters = Boolean(query.trim()) || status !== 'todos' || region !== 'todas';

  // Cambiar un filtro siempre regresa a la página 1
  const onFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };
  const clearFilters = () => {
    setQuery('');
    setAppliedQuery('');
    setStatus('todos');
    setRegion('todas');
    setPage(1);
  };

  return (
    <div className="server-table">
      {!compact && (
        <form className="filters" role="search" aria-label="Filtrar servidores" onSubmit={(e) => e.preventDefault()}>
          <div className="field filters__search">
            <label className="field__label" htmlFor="f-buscar">
              Buscar
            </label>
            <Control loading={searching}>
              <input
                id="f-buscar"
                className="input"
                type="search"
                placeholder="Nombre o IP…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-busy={searching || undefined}
              />
            </Control>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="f-estado">
              Estado
            </label>
            <select id="f-estado" className="select" value={status} onChange={onFilter(setStatus)}>
              <option value="todos">Todos</option>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="f-region">
              Región
            </label>
            <select id="f-region" className="select" value={region} onChange={onFilter(setRegion)}>
              <option value="todas">Todas</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn--secondary filters__clear" onClick={clearFilters} disabled={!hasFilters}>
            Limpiar filtros
          </button>
        </form>
      )}

      {!compact && (
        <p className="server-table__count" aria-live="polite">
          {searching
            ? 'Buscando…'
            : filtered.length
              ? `Mostrando ${from}–${to} de ${filtered.length} servidores`
              : 'Ningún servidor coincide con los filtros'}
        </p>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <caption className="visually-hidden">
            {compact ? 'Servidores con mayor uso de CPU' : 'Lista de servidores'}
          </caption>
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">Región</th>
              <th scope="col">CPU</th>
              <th scope="col">RAM</th>
              {!compact && <th scope="col">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.id}>
                <td data-label="Nombre" className="data-table__name">
                  <strong>{s.name}</strong>
                  <span>{s.ip}</span>
                </td>
                <td data-label="Estado">
                  <StatusBadge status={s.status} />
                </td>
                <td data-label="Región">{s.region}</td>
                <td data-label="CPU">
                  <Meter value={s.cpu} threshold={threshold} />
                </td>
                <td data-label="RAM">
                  <Meter value={s.ram} threshold={threshold} />
                </td>
                {!compact && (
                  <td data-label="Acciones" className="data-table__actions">
                    <div className="btn-group btn-group--inline" role="group" aria-label={`Acciones de ${s.name}`}>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => onConfigure(s)}
                        aria-label={`Configurar ${s.name}`}
                      >
                        <Icon name="settings" size={18} />
                        Configurar
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger-ghost"
                        onClick={() => onDelete(s)}
                        aria-label={`Eliminar ${s.name}`}
                      >
                        <Icon name="trash" size={18} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="data-table__empty">
                  <p>No hay servidores que coincidan con los filtros.</p>
                  <button type="button" className="btn btn--secondary" onClick={clearFilters}>
                    Limpiar filtros
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!compact && <Pagination page={current} totalPages={totalPages} onChange={setPage} />}
    </div>
  );
}
