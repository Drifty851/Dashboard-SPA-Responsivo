import './Charts.css';

const W = 600;
const H = 200;

// Gráfica de líneas en SVG. viewBox fijo + preserveAspectRatio="none"
// hace que se estire al tamaño de la tarjeta.
export default function LineChart({ series, max = 100, label }) {
  const points = (values) =>
    values.map((v, i) => `${(i / (values.length - 1 || 1)) * W},${H - (v / max) * H}`).join(' ');

  return (
    <figure className="chart">
      <ul role="list" className="chart__legend">
        {series.map((s) => (
          <li key={s.name}>
            <span className="chart__dot" style={{ background: s.color }} aria-hidden="true" />
            {s.name} <strong>{s.values.at(-1)} {s.unit}</strong>
          </li>
        ))}
      </ul>

      <div className="chart__plot">
        <div className="chart__axis" aria-hidden="true">
          <span>{max} %</span>
          <span>{max / 2} %</span>
          <span>0 %</span>
        </div>
        <svg
          className="chart__svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={label}
        >
          {[0, 0.5, 1].map((f) => (
            <line key={f} className="chart__grid" x1="0" x2={W} y1={H * f} y2={H * f} />
          ))}
          {series.map((s) => (
            <polyline
              key={s.name}
              points={points(s.values)}
              fill="none"
              style={{ stroke: s.color }}
              strokeWidth="2.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
    </figure>
  );
}
