import { useServers } from '../context/ServersContext';
import ServerTable from '../components/content/ServerTable';

export default function Servers({ query, onConfigure, onDelete }) {
  const { servers, cpuThreshold } = useServers();

  return (
    <section aria-labelledby="titulo-pagina">
      <div className="page-header">
        <h1 id="titulo-pagina" className="page-header__title">
          Servidores
        </h1>
      </div>
      {/* key={query}: si llega una búsqueda nueva desde el header, la tabla se reinicia con ella */}
      <ServerTable
        key={query}
        servers={servers}
        threshold={cpuThreshold}
        initialQuery={query}
        onConfigure={onConfigure}
        onDelete={onDelete}
      />
    </section>
  );
}
