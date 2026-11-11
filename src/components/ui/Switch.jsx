import './Switch.css';

// Interruptor accesible con los 5 estados: <button role="switch" aria-checked>
export default function Switch({ id, label, description, checked, onChange, disabled = false, loading = false }) {
  return (
    <div className="switch-field">
      <div className="switch-field__text">
        <span id={`${id}-label`} className="field__label">
          {label}
        </span>
        {description && (
          <span id={`${id}-desc`} className="field__hint">
            {description}
          </span>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        className="switch"
        aria-checked={checked}
        aria-busy={loading || undefined}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={() => !loading && onChange(!checked)}
      >
        <span className="switch__thumb" aria-hidden="true">
          {loading && <span className="spinner spinner--sm" />}
        </span>
      </button>
    </div>
  );
}
