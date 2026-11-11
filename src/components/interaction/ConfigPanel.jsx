import { useEffect, useRef, useState } from 'react';
import { INSTANCE_TYPES } from '../../data/servers';
import Dialog, { useDialogItem } from './Dialog';
import Button from '../ui/Button';
import Control from '../ui/Control';
import Icon from '../ui/Icon';
import Switch from '../ui/Switch';
import '../ui/Form.css';

const LOAD_MS = 600; // simula la carga de la configuración del servidor
const SAVE_MS = 800; // simula la petición de guardado

// Panel deslizante contextual para configurar los parámetros de un servidor
export default function ConfigPanel({ server, onClose, onSave }) {
  const [shown, session] = useDialogItem(server);
  const [busy, setBusy] = useState(false);

  return (
    <Dialog
      open={Boolean(server)}
      onClose={onClose}
      preventClose={busy}
      className="drawer"
      labelledBy="drawer-title"
      closeOnBackdrop
    >
      {shown && (
        <ConfigForm key={session} server={shown} onClose={onClose} onSave={onSave} onBusyChange={setBusy} />
      )}
    </Dialog>
  );
}

function ConfigForm({ server, onClose, onSave, onBusyChange }) {
  const nameRef = useRef(null);
  const saveTimer = useRef(null);
  const [form, setForm] = useState({
    name: server.name,
    description: server.description,
    type: server.type,
    maintenance: server.maintenance,
    autoscale: server.autoscale,
    maxInstances: server.maxInstances,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  // 1) Al abrir: estado Loading en todos los campos
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOAD_MS);
    return () => {
      clearTimeout(t);
      clearTimeout(saveTimer.current);
    };
  }, []);

  useEffect(() => onBusyChange(saving), [saving, onBusyChange]);

  const locked = loading || saving;
  const set = (key) => (e) => !locked && setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (locked) return;
    if (!form.name.trim()) {
      setError('Escribe un nombre para el servidor.');
      nameRef.current.focus();
      return;
    }
    // 2) Al guardar: botón en Loading y panel bloqueado hasta terminar
    setSaving(true);
    saveTimer.current = setTimeout(() => {
      setSaving(false);
      onSave({
        id: server.id,
        ...form,
        name: form.name.trim(),
        maxInstances: Math.min(20, Math.max(1, Number(form.maxInstances) || 1)),
      });
    }, SAVE_MS);
  };

  // Props comunes del estado Loading para cada campo
  const busy = { 'aria-busy': loading || undefined, readOnly: locked };

  return (
    <form className="drawer__inner" onSubmit={submit} noValidate>
      <header className="drawer__header">
        <span className="drawer__handle" aria-hidden="true" />
        <div>
          <h2 id="drawer-title" className="drawer__title">
            Configurar servidor
          </h2>
          <p className="drawer__subtitle">
            {server.name} · {server.ip}
          </p>
          <p className="drawer__status" role="status">
            {loading ? 'Cargando configuración…' : saving ? 'Guardando cambios…' : ''}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={onClose}
          disabled={saving}
          aria-label="Cerrar panel"
        >
          <Icon name="x" />
        </button>
      </header>

      <div className="drawer__body">
        <div className="field">
          <label className="field__label" htmlFor="cfg-name">
            Nombre del servidor
          </label>
          <Control loading={loading}>
            <input
              ref={nameRef}
              id="cfg-name"
              className="input"
              value={form.name}
              onChange={(e) => {
                set('name')(e);
                setError('');
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'cfg-name-error' : undefined}
              autoComplete="off"
              {...busy}
            />
          </Control>
          {error && (
            <p id="cfg-name-error" className="field__error">
              {error}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="cfg-desc">
            Descripción
          </label>
          <Control loading={loading}>
            <textarea
              id="cfg-desc"
              className="textarea"
              rows={3}
              maxLength={200}
              value={form.description}
              onChange={set('description')}
              aria-describedby="cfg-desc-hint"
              {...busy}
            />
          </Control>
          <p id="cfg-desc-hint" className="field__hint">
            {form.description.length}/200 caracteres
          </p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="cfg-type">
            Tipo de instancia
          </label>
          <Control loading={loading}>
            {/* <select> no admite readOnly: mientras carga se deshabilita (con estilo de Loading) */}
            <select
              id="cfg-type"
              className="select"
              value={form.type}
              onChange={set('type')}
              disabled={locked}
              aria-busy={loading || undefined}
            >
              {INSTANCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Control>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="cfg-date">
            Ventana de mantenimiento
          </label>
          <Control loading={loading}>
            <input
              id="cfg-date"
              className="input"
              type="date"
              min={today}
              value={form.maintenance}
              onChange={set('maintenance')}
              aria-describedby="cfg-date-hint"
              {...busy}
            />
          </Control>
          <p id="cfg-date-hint" className="field__hint">
            El servidor se reiniciará ese día a las 02:00.
          </p>
        </div>

        <Switch
          id="cfg-autoscale"
          label="Autoescalado"
          description="Agrega instancias cuando la CPU supera el umbral."
          checked={form.autoscale}
          loading={loading}
          disabled={saving}
          onChange={(v) => setForm((f) => ({ ...f, autoscale: v }))}
        />

        <div className="field">
          <label className="field__label" htmlFor="cfg-max">
            Máximo de instancias
          </label>
          <Control loading={loading}>
            <input
              id="cfg-max"
              className="input"
              type="number"
              min={1}
              max={20}
              value={form.maxInstances}
              onChange={set('maxInstances')}
              disabled={!form.autoscale}
              aria-describedby="cfg-max-hint"
              {...busy}
            />
          </Control>
          <p id="cfg-max-hint" className="field__hint">
            {form.autoscale ? 'Entre 1 y 20 instancias.' : 'Activa el autoescalado para editar este valor.'}
          </p>
        </div>
      </div>

      <footer className="drawer__footer">
        <div className="btn-group btn-group--inline">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" icon="check" loading={saving} loadingText="Guardando…" disabled={loading}>
            Guardar cambios
          </Button>
        </div>
      </footer>
    </form>
  );
}
