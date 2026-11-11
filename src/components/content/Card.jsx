import Icon from '../ui/Icon';
import './Card.css';

export default function Card({ title, icon, action, footer, className = '', children }) {
  return (
    <article className={`card ${className}`}>
      <header className="card__header">
        {icon && (
          <span className="card__icon">
            <Icon name={icon} size={18} />
          </span>
        )}
        <h2 className="card__title">{title}</h2>
        {action}
      </header>

      <div className="card__body">{children}</div>

      {footer && <footer className="card__footer">{footer}</footer>}
    </article>
  );
}
