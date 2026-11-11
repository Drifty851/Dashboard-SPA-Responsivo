import './Charts.css';

// Gráfica de barras con Flexbox: cada barra es un <span> cuya altura
// es el porcentaje del valor (variable CSS --h).
export default function BarChart({ values, unit, max = 100, label }) {
  return (
    <figure className="chart">
      <p className="chart__current">
        Actual: <strong>{values.at(-1)} {unit}</strong>
      </p>
      <div className="bars" role="img" aria-label={label}>
        {values.map((v, i) => (
          <span key={i} className="bars__bar" style={{ '--h': `${(v / max) * 100}%` }} />
        ))}
      </div>
    </figure>
  );
}
