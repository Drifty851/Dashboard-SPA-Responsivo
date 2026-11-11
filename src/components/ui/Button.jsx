import Icon from './Icon';
import './Button.css';

// Botón con los 5 estados. En "loading":
//  - aria-busy="true" (lectores de pantalla y estilos)
//  - spinner en lugar del icono y texto de progreso ("Guardando…")
//  - ignora clics, pero NO usa disabled para no perder el foco del teclado
export default function Button({
  variant = 'secondary',
  icon,
  loading = false,
  loadingText,
  className = '',
  children,
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <button
      {...rest}
      type={type}
      className={`btn btn--${variant} ${className}`.trim()}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : icon && <Icon name={icon} size={18} />}
      <span>{loading && loadingText ? loadingText : children}</span>
    </button>
  );
}
