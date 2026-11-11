import './Button.css';

// Agrupa botones relacionados. `role="group"` + `aria-label` le dicen al
// lector de pantalla que estos botones forman un conjunto.
export default function ButtonGroup({ label, inline = false, children }) {
  return (
    <div className={`btn-group${inline ? ' btn-group--inline' : ''}`} role="group" aria-label={label}>
      {children}
    </div>
  );
}
