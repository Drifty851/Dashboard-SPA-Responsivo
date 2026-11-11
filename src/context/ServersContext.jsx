import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { createServers, mulberry32 } from '../data/servers';

// Estado global de la app: servidores, historial de métricas y preferencias.
// Un setInterval simula la llegada de métricas en tiempo real.

const HISTORY_MAX = 450; // 15 min de historial a 1 lectura cada 2 s

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const push = (arr, v) => [...arr.slice(-(HISTORY_MAX - 1)), v];

function average(servers, key) {
  const online = servers.filter((s) => !s.offline);
  if (!online.length) return 0;
  return Math.round(online.reduce((sum, s) => sum + s[key], 0) / online.length);
}

// Historial inicial: un "paseo aleatorio" que termina en los valores actuales
function seedHistory(servers) {
  const rand = mulberry32(7);
  const cpu = [];
  const ram = [];
  const net = [];
  let c = average(servers, 'cpu');
  let r = average(servers, 'ram');
  let n = 48;
  for (let i = 0; i < HISTORY_MAX; i++) {
    cpu.unshift(Math.round(c));
    ram.unshift(Math.round(r));
    net.unshift(Math.round(n));
    c = clamp(c + (rand() - 0.5) * 6, 10, 95);
    r = clamp(r + (rand() - 0.5) * 4, 20, 95);
    n = clamp(n + (rand() - 0.5) * 20, 10, 100);
  }
  return { cpu, ram, net };
}

function init() {
  const servers = createServers();
  return {
    servers,
    history: seedHistory(servers),
    live: true,
    intervalMs: 2000,
    cpuThreshold: 85,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      // La aleatoriedad viene de una semilla en la acción: el reducer sigue siendo puro
      const rand = mulberry32(action.seed);
      const servers = state.servers.map((s) =>
        s.offline
          ? s
          : {
              ...s,
              cpu: Math.round(clamp(s.cpu + (rand() - 0.5) * 12, 3, 99)),
              ram: Math.round(clamp(s.ram + (rand() - 0.5) * 6, 10, 98)),
            }
      );
      const lastNet = state.history.net.at(-1);
      return {
        ...state,
        servers,
        history: {
          cpu: push(state.history.cpu, average(servers, 'cpu')),
          ram: push(state.history.ram, average(servers, 'ram')),
          net: push(state.history.net, Math.round(clamp(lastNet + (rand() - 0.5) * 25, 5, 100))),
        },
      };
    }
    case 'UPDATE_SERVER':
      return {
        ...state,
        servers: state.servers.map((s) => (s.id === action.server.id ? { ...s, ...action.server } : s)),
      };
    case 'DELETE_SERVER':
      return { ...state, servers: state.servers.filter((s) => s.id !== action.id) };
    case 'SET_LIVE':
      return { ...state, live: action.live };
    case 'SET_SETTINGS':
      return { ...state, intervalMs: action.intervalMs, cpuThreshold: action.cpuThreshold };
    default:
      return state;
  }
}

const ServersContext = createContext(null);

export function ServersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  // "Tiempo real": nueva lectura cada intervalMs mientras no esté en pausa
  useEffect(() => {
    if (!state.live) return undefined;
    const id = setInterval(
      () => dispatch({ type: 'TICK', seed: Math.floor(Math.random() * 2 ** 31) }),
      state.intervalMs
    );
    return () => clearInterval(id);
  }, [state.live, state.intervalMs]);

  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <ServersContext.Provider value={value}>{children}</ServersContext.Provider>;
}

export function useServers() {
  const ctx = useContext(ServersContext);
  if (!ctx) throw new Error('useServers debe usarse dentro de <ServersProvider>');
  return ctx;
}
