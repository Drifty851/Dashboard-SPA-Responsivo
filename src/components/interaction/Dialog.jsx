import { useEffect, useRef, useState } from 'react';
import './Interaction.css';

// Envoltura del <dialog> nativo de HTML5. showModal() nos da gratis:
//  - tecla Escape para cerrar (evento "cancel")
//  - foco atrapado dentro del diálogo y devuelto al cerrar
//  - fondo inerte con ::backdrop
// Además añade animación de cierre: la clase .is-closing reproduce la
// animación de salida y DESPUÉS se llama a dialog.close().
const CLOSE_MS = 200;

export default function Dialog({
  open,
  onClose,
  preventClose = false,
  className = '',
  labelledBy,
  describedBy,
  closeOnBackdrop = false,
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;

    if (open) {
      dialog.classList.remove('is-closing');
      if (!dialog.open) dialog.showModal();
      return undefined;
    }

    if (!dialog.open) return undefined;
    dialog.classList.add('is-closing');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => {
      dialog.classList.remove('is-closing');
      dialog.close();
    }, reduce ? 0 : CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open]);

  const requestClose = () => {
    if (!preventClose) onClose();
  };

  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      // Escape: cancelamos el cierre nativo para poder animarlo
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      // Respaldo: si el navegador cierra el diálogo por su cuenta, sincronizamos el estado
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === ref.current) requestClose();
      }}
    >
      {children}
    </dialog>
  );
}

// Mantiene visible el último elemento mientras se anima el cierre y
// genera una "sesión" nueva cada vez que se abre (para reiniciar formularios).
export function useDialogItem(item) {
  const [shown, setShown] = useState(item);
  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(Boolean(item));

  if (Boolean(item) !== wasOpen) {
    setWasOpen(Boolean(item));
    if (item) {
      setShown(item);
      setSession((s) => s + 1);
    }
  }

  return [item ?? shown, session];
}
