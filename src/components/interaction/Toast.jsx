import { useEffect } from 'react';
import Icon from '../ui/Icon';
import './Interaction.css';

// Mensaje breve de confirmación. role="status" hace que el lector de
// pantalla lo anuncie sin interrumpir lo que el usuario está haciendo.
export default function Toast({ toast, onDone, duration = 4000 }) {
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [toast, onDone, duration]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast">
          <Icon name="check" size={18} />
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
