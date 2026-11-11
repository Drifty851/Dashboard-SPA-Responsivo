import { useEffect, useRef, useState } from 'react';
import { useServers } from '../context/ServersContext';
import Card from '../components/content/Card';
import Button from '../components/ui/Button';
import ButtonGroup from '../components/ui/ButtonGroup';
import '../components/ui/Form.css';
import './Settings.css';

const INTERVALS = [
  [1000, '1 segundo'],
  [2000, '2 segundos'],
  [5000, '5 segundos'],
  [10000, '10 segundos'],
];

export default function Settings({ onSaved }) {
  const { intervalMs, cpuThreshold, dispatch } = useServers();
  const [interval, setIntervalValue] = useState(intervalMs);
  const [threshold, setThreshold] = useState(cpuThreshold);
  const invalid = threshold === '' || threshold < 50 || threshold > 99;

  const [saving, setSaving] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = (e) => {
    e.preventDefault();
    if (invalid || saving) return;
    setSaving(true); // estado Loading del botón
    timer.current = setTimeout(() => {
      dispatch({ type: 'SET_SETTINGS', intervalMs: Number(interval), cpuThreshold: Number(threshold) });
      setSaving(false);
      onSaved('Preferencias guardadas.');
    }, 800);
  };

  return (
    <section aria-labelledby="titulo-pagina">
      <div className="page-header">
        <h1 id="titulo-pagina" className="page-header__title">
          Configuración
        </h1>
      </div>

      <Card title="Preferencias de monitoreo" icon="settings" className="settings-card">
        <form className="settings-form" onSubmit={submit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="set-interval">
              Intervalo de actualización
            </label>
            <select
              id="set-interval"
              className="select"
              value={interval}
              onChange={(e) => setIntervalValue(e.target.value)}
              aria-describedby="set-interval-hint"
            >
              {INTERVALS.map(([ms, label]) => (
                <option key={ms} value={ms}>
                  {label}
                </option>
              ))}
            </select>
            <p id="set-interval-hint" className="field__hint">
              Cada cuánto llegan nuevas métricas al dashboard.
            </p>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="set-threshold">
              Umbral de alerta de CPU (%)
            </label>
            <input
              id="set-threshold"
              className="input"
              type="number"
              min={50}
              max={99}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value === '' ? '' : Number(e.target.value))}
              aria-invalid={invalid}
              aria-describedby="set-threshold-hint"
            />
            <p id="set-threshold-hint" className={invalid ? 'field__error' : 'field__hint'}>
              {invalid
                ? 'Escribe un valor entre 50 y 99.'
                : 'Los servidores con CPU igual o mayor se marcan como "Alerta".'}
            </p>
          </div>

          <ButtonGroup label="Guardar preferencias">
            <Button type="submit" variant="primary" icon="check" disabled={invalid} loading={saving} loadingText="Guardando…">
              Guardar preferencias
            </Button>
          </ButtonGroup>
        </form>
      </Card>
    </section>
  );
}
