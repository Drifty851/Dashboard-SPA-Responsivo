// Datos simulados de servidores e instancias cloud.
// Se usa un generador aleatorio con semilla para que los datos iniciales
// sean siempre los mismos (capturas reproducibles para el reporte).

export function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'sa-east-1'];
export const INSTANCE_TYPES = ['t3.micro', 't3.small', 't3.medium', 't3.large', 'm5.xlarge'];

export const STATUS_LABEL = {
  online: 'En línea',
  warning: 'Alerta',
  offline: 'Sin conexión',
};

const GROUPS = [
  ['web', 6, 'Servidor web de la aplicación'],
  ['api', 5, 'API REST principal'],
  ['db', 4, 'Base de datos PostgreSQL'],
  ['cache', 3, 'Caché Redis'],
  ['worker', 4, 'Procesamiento de tareas en segundo plano'],
  ['cdn', 2, 'Nodo de distribución de contenido'],
];

const OFFLINE = new Set(['worker-04', 'cdn-02']);

export function createServers() {
  const rand = mulberry32(42);
  const list = [];
  let n = 0;

  for (const [prefix, count, description] of GROUPS) {
    for (let i = 1; i <= count; i++) {
      const name = `${prefix}-${String(i).padStart(2, '0')}`;
      const r = Math.floor(rand() * REGIONS.length);
      const offline = OFFLINE.has(name);
      list.push({
        id: name,
        name,
        ip: `10.0.${r + 1}.${11 + n}`,
        region: REGIONS[r],
        type: INSTANCE_TYPES[Math.floor(rand() * INSTANCE_TYPES.length)],
        description,
        offline,
        cpu: offline ? 0 : Math.round(20 + rand() * 55),
        ram: offline ? 0 : Math.round(30 + rand() * 50),
        autoscale: rand() > 0.5,
        maxInstances: 2 + Math.floor(rand() * 6),
        maintenance: '',
      });
      n++;
    }
  }

  // Un servidor arranca sobrecargado para que haya una alerta visible
  list.find((s) => s.id === 'web-03').cpu = 92;
  return list;
}

// El estado se deriva de la CPU y del umbral configurado por el usuario
export function statusOf(server, threshold) {
  if (server.offline) return 'offline';
  return server.cpu >= threshold ? 'warning' : 'online';
}
