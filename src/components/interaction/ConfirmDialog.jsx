import { useEffect, useRef, useState } from 'react';
import Dialog, { useDialogItem } from './Dialog';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import '../ui/Form.css';

const DELETE_MS = 800; // simula la petición de borrado

// Modal de confirmación para acciones destructivas.
// Confirmación segura: hay que escribir el nombre exacto del servidor.
// A propósito NO se cierra con clic en el fondo.
export default function ConfirmDialog({ server, onCancel, onConfirm }) {
  const [shown, session] = useDialogItem(server);
  const [busy, setBusy] = useState(false);

  return (
    <Dialog
      open={Boolean(server)}
      onClose={onCancel}
      preventClose={busy}
      className="modal"
      labelledBy="modal-title"
      describedBy="modal-desc"
    >
      {shown && (
        <ConfirmBody key={session} server={shown} onCancel={onCancel} onConfirm={onConfirm} onBusyChange={setBusy} />
      )}
    </Dialog>
  );
}

function ConfirmBody({ server, onCancel, onConfirm, onBusyChange }) {
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timer = useRef(null);
  const matches = text.trim() === server.name;

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => onBusyChange(deleting), [deleting, onBusyChange]);

  const submit = (e) => {
    e.preventDefault();
    if (!matches || deleting) return;
    setDeleting(true);
    timer.current = setTimeout(() => {
      setDeleting(false);
      onConfirm(server);
    }, DELETE_MS);
  };

  return (
    <form className="modal__inner" onSubmit={submit}>
      <span className="modal__icon" aria-hidden="true">
        <Icon name="alert" size={24} />
      </span>
      <h2 id="modal-title" className="modal__title">
        ¿Eliminar el servidor {server.name}?
      </h2>
      <p id="modal-desc" className="modal__text">
        Esta acción no se puede deshacer. Se eliminarán la instancia y todos sus datos.
      </p>

      <div className="field">
        <label className="field__label" htmlFor="confirm-name">
          Escribe <strong>{server.name}</strong> para confirmar
        </label>
        <input
          id="confirm-name"
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          readOnly={deleting}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="btn-group modal__actions">
        <Button variant="secondary" onClick={onCancel} disabled={deleting}>
          Cancelar
        </Button>
        <Button type="submit" variant="danger" icon="trash" disabled={!matches} loading={deleting} loadingText="Eliminando…">
          Eliminar servidor
        </Button>
      </div>
    </form>
  );
}
