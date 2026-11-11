import { useState } from 'react';
import { useServers } from '../context/ServersContext';
import { statusOf } from '../data/servers';
import Card from '../components/content/Card';
import LineChart from '../components/content/LineChart';
import BarChart from '../components/content/BarChart';
import ServerTable from '../components/content/ServerTable';
import ButtonGroup from '../components/ui/ButtonGroup';
import Icon from '../components/ui/Icon';
import './Dashboard.css';

const RANGES = [1, 5, 15]; // minutos

export default function Dashboard() {
  const { servers, history, live, intervalMs, cpuThreshold, dispatch } = useServers();
  const [range, setRange] = useState(5);

  const withStatus = servers.map((s) => ({ ...s, status: statusOf(s, cpuThreshold) }));
  const active = withStatus.filter((s) => s.status !== 'offline').length;
  const alerts = withStatus
    .filter((s) => s.status !== 'online')
    .sort((a, b) => (a.status === 'offline' ? -1 : b.status === 'offline' ? 1 : b.cpu - a.cpu));
  const critical = alerts.filter((s) => s.status === 'offline').length;
  const cpuNow = history.cpu.at(-1);
  const ramNow = history.ram.at(-1);

  // Cuántas lecturas caben en el rango elegido según el intervalo configurado
  const points = Math.min(history.cpu.length, Math.max(2, Math.round((range * 60000) / intervalMs)));

  const status = [
    { title: 'Servidores activos', icon: 'server', value: `${active} / ${servers.length}`, meta: 'en línea' },
    { title: 'Alertas activas', icon: 'alert', value: alerts.length, meta: `${critical} críticas` },
    { title: 'CPU promedio', icon: 'cpu', value: `${cpuNow} %`, meta: 'lectura actual' },
    { title: 'RAM promedio', icon: 'memory', value: `${ramNow} %`, meta: 'lectura actual' },
  ];

  return (
    <section aria-labelledby="titulo-pagina">
      <div className="page-header">
        <h1 id="titulo-pagina" className="page-header__title">
          Dashboard
        </h1>
        <ButtonGroup label="Acciones del dashboard" inline>
          <button
            type="button"
            className="btn btn--secondary"
            aria-pressed={!live}
            onClick={() => dispatch({ type: 'SET_LIVE', live: !live })}
          >
            <Icon name={live ? 'pause' : 'play'} size={18} />
            {live ? 'Pausar' : 'Reanudar'}
          </button>
          <a href="#/servidores" className="btn btn--primary">
            <Icon name="server" size={18} />
            Ver servidores
          </a>
        </ButtonGroup>
      </div>

      <p className="live-status">
        <span className={`live-status__dot${live ? ' is-live' : ''}`} aria-hidden="true" />
        {live ? `En vivo · actualiza cada ${intervalMs / 1000} s` : 'Actualización en pausa'}
      </p>

      <div className="bento">
        {status.map((s) => (
          <Card key={s.title} title={s.title} icon={s.icon} className="bento__item bento__item--status">
            <p className="stat">
              <span className="stat__value">{s.value}</span>
              <span className="stat__meta">{s.meta}</span>
            </p>
          </Card>
        ))}

        <Card
          title="CPU / RAM en tiempo real"
          icon="activity"
          className="bento__item bento__item--chart"
          footer={
            <ButtonGroup label="Rango de tiempo" inline>
              {RANGES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className="btn btn--secondary"
                  aria-pressed={range === m}
                  onClick={() => setRange(m)}
                >
                  {m} min
                </button>
              ))}
            </ButtonGroup>
          }
        >
          <LineChart
            label={`Uso promedio en los últimos ${range} minutos: CPU ${cpuNow} %, RAM ${ramNow} %`}
            series={[
              { name: 'CPU', color: 'var(--chart-1)', unit: '%', values: history.cpu.slice(-points) },
              { name: 'RAM', color: 'var(--chart-2)', unit: '%', values: history.ram.slice(-points) },
            ]}
          />
        </Card>

        <Card title="Tráfico de red" icon="network" className="bento__item bento__item--network">
          <BarChart
            unit="Mb/s"
            values={history.net.slice(-14)}
            label={`Tráfico de red de las últimas 14 lecturas; actual ${history.net.at(-1)} Mb/s`}
          />
        </Card>

        <Card
          title="Servidores con más carga"
          icon="list"
          className="bento__item bento__item--table"
          footer={
            <a href="#/servidores" className="btn btn--secondary">
              Ver todos los servidores
            </a>
          }
        >
          <ServerTable servers={servers} threshold={cpuThreshold} compact />
        </Card>

        <Card title="Alertas recientes" icon="alert" className="bento__item bento__item--alerts">
          {alerts.length ? (
            <ul role="list" className="alert-list">
              {alerts.slice(0, 4).map((a) => (
                <li key={a.id} className={`alert-list__item alert-list__item--${a.status}`}>
                  <Icon name="alert" size={18} />
                  <span className="alert-list__text">
                    {a.status === 'offline' ? `${a.name}: sin conexión` : `${a.name}: CPU al ${a.cpu} %`}
                  </span>
                  <span className="alert-list__tag">{a.status === 'offline' ? 'Crítica' : 'Alerta'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">Todo en orden: no hay alertas activas.</p>
          )}
        </Card>
      </div>
    </section>
  );
}
