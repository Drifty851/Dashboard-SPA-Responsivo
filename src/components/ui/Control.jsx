import './Form.css';

// Envoltura de un campo que añade el estado "Loading" (spinner a la derecha).
// El campo hijo debe recibir aria-busy y readOnly/disabled mientras carga.
export default function Control({ loading = false, children }) {
  return (
    <div className={`control${loading ? ' is-loading' : ''}`}>
      {children}
      {loading && <span className="spinner control__spinner" aria-hidden="true" />}
    </div>
  );
}
