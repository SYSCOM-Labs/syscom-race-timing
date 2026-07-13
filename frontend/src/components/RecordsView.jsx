import { useState, useMemo } from 'react';
import {
  Zap, Flame, Sun, Trophy, Shield, Crosshair, Rocket, Wind, Star, Gem, Mountain, Waves,
  Car, Bike, Ship, Plane, Siren, Radar, Navigation, Compass, LocateFixed,
  Eye, Bolt, Lightbulb, Sparkles, Cloud, Moon, Sunrise, Sunset, Rainbow,
  Leaf, TreePine, Flower2, Cherry, Shell, PawPrint, Bird, Fish, Turtle, Snail, Rabbit,
  Diamond, Crown, Medal, Award, Swords, ShieldCheck, Target, Hash,
  Heart, Anchor, Magnet, Key, Lock, Unlock, Globe, Map,
  Activity, Circle, Triangle, Square, Hexagon, Octagon, Pentagon,
  Music, Volume2, Camera, Film, Tv, Watch, Clock, Timer,
  Coffee, Pizza, Cake, Apple, Beer, Wine,
  Laugh, Frown, Meh, Smile, Skull,
  Search, ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';
import usePilots from '../hooks/usePilots.js';
import { THEMES } from '../theme.js';

const LUCIDE_PREFIX = '__lucide__';

const LUCIDE_ICONS_MAP = {
  Zap, Flame, Sun, Moon, Star, Sparkles, Cloud, Sunrise, Sunset, Rainbow,
  Bolt, Lightbulb, Eye, Trophy, Medal, Award, Crown, Diamond, Gem,
  Shield, ShieldCheck, Crosshair, Target, Swords, Rocket, Siren,
  Car, Bike, Ship, Plane, Compass, Navigation, LocateFixed, Radar,
  Anchor, Magnet, Key, Lock, Unlock, Globe, Map,
  Wind, Mountain, Waves, Leaf, TreePine, Flower2, Cherry, Shell,
  PawPrint, Bird, Fish, Turtle, Snail, Rabbit,
  Heart, Hash, Activity, Circle, Triangle, Square, Hexagon, Octagon, Pentagon,
  Music, Volume2, Camera, Film, Tv, Watch, Clock, Timer,
  Coffee, Pizza, Cake, Apple, Beer, Wine,
  Smile, Laugh, Frown, Meh, Skull,
};

function isLucideIcon(value) {
  return typeof value === 'string' && value.startsWith(LUCIDE_PREFIX);
}

function renderIcon(value, size = 'w-5 h-5') {
  if (isLucideIcon(value)) {
    const name = value.replace(LUCIDE_PREFIX, '');
    const IconComp = LUCIDE_ICONS_MAP[name];
    if (IconComp) return <IconComp className={size} />;
  }
  return <span className="text-lg leading-none">{value || '🏎️'}</span>;
}

function formatTime(ms) {
  if (ms == null) return null;
  const s = Math.floor(ms / 1000);
  const cent = Math.floor((ms % 1000) / 10);
  return `${s}.${String(cent).padStart(2, '0')}s`;
}

function loadFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function getSortIcon(currentKey, targetKey, asc) {
  if (currentKey !== targetKey) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return asc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
}

export default function RecordsView({ autos, themeMode }) {
  const accent = THEMES[themeMode].accent;
  const { pilots } = usePilots();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('vueltas');
  const [sortAsc, setSortAsc] = useState(false);

  const speedRecords = useMemo(() => loadFromStorage('syscom_records_velocidad'), []);
  const brakeRecords = useMemo(() => loadFromStorage('syscom_records_frenado'), []);

  const bestSpeedByMatricula = useMemo(() => {
    const map = {};
    speedRecords.forEach(r => {
      if (!map[r.matricula] || r.tiempoMs < map[r.matricula]) {
        map[r.matricula] = r.tiempoMs;
      }
    });
    return map;
  }, [speedRecords]);

  const bestBrakeByMatricula = useMemo(() => {
    const map = {};
    brakeRecords.forEach(r => {
      if (!map[r.matricula] || r.tiempoMs < map[r.matricula]) {
        map[r.matricula] = r.tiempoMs;
      }
    });
    return map;
  }, [brakeRecords]);

  const autoByMatricula = useMemo(() => {
    const map = {};
    autos.forEach(a => { map[a.matricula] = a; });
    return map;
  }, [autos]);

  const records = useMemo(() => {
    return pilots.map(pilot => {
      const auto = autoByMatricula[pilot.matricula];
      return {
        ...pilot,
        vueltas: auto?.vueltas || 0,
        mejorVuelta: auto?.mejorVuelta || null,
        velocidadTiempo: bestSpeedByMatricula[pilot.matricula] || null,
        frenadoTiempo: bestBrakeByMatricula[pilot.matricula] || null,
      };
    });
  }, [pilots, autoByMatricula, bestSpeedByMatricula, bestBrakeByMatricula]);

  const filtered = useMemo(() => {
    let result = records;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(r =>
        r.piloto.toLowerCase().includes(q) ||
        r.matricula.toLowerCase().includes(q) ||
        r.empresa.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let va, vb;
      if (sortKey === 'vueltas') { va = a.vueltas; vb = b.vueltas; }
      else if (sortKey === 'velocidad') { va = a.velocidadTiempo ?? Infinity; vb = b.velocidadTiempo ?? Infinity; }
      else if (sortKey === 'frenado') { va = a.frenadoTiempo ?? Infinity; vb = b.frenadoTiempo ?? Infinity; }
      else { va = 0; vb = 0; }

      if (sortAsc) return va > vb ? 1 : va < vb ? -1 : 0;
      return va < vb ? 1 : va > vb ? -1 : 0;
    });

    return result;
  }, [records, search, sortKey, sortAsc]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(prev => !prev);
    else { setSortKey(key); setSortAsc(key === 'frenado' || key === 'velocidad'); }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-card-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, matrícula o empresa..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">Ordenar:</span>
            {[
              { key: 'vueltas', label: 'Vueltas' },
              { key: 'velocidad', label: 'Velocidad' },
              { key: 'frenado', label: 'Frenado' },
            ].map(({ key, label }) => {
              const isActive = sortKey === key;
              return (
                <button
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? accent : 'transparent',
                    color: isActive ? 'white' : '#888',
                  }}
                >
                  {label}
                  {isActive && getSortIcon(sortKey, key, sortAsc)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-card-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            {filtered.length} piloto{filtered.length !== 1 ? 's' : ''} — Registros consolidados
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium w-10">#</th>
                <th className="text-left py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Piloto</th>
                <th className="text-left py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Matrícula</th>
                <th className="text-left py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Empresa</th>
                <th className="text-center py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Vueltas</th>
                <th className="text-center py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Mejor Vuelta</th>
                <th className="text-center py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">T. Velocidad</th>
                <th className="text-center py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">T. Frenado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    {search ? 'No se encontraron pilotos con ese criterio' : 'No hay pilotos registrados'}
                  </td>
                </tr>
              ) : filtered.map((r, i) => {
                const isFirst = i === 0;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 transition-all duration-200 hover:bg-gray-50"
                    style={{ backgroundColor: isFirst ? accent + '08' : undefined }}
                  >
                    <td className="py-3 px-4 font-bold text-xs" style={{ color: isFirst ? accent : '#888' }}>
                      {i + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: (r.color || accent) + '15', color: r.color || accent }}
                        >
                          {renderIcon(r.icono, 'w-4 h-4')}
                        </div>
                        <span className="font-semibold text-gray-800 text-xs whitespace-nowrap">{r.piloto}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="text-[10px] font-bold text-white px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: r.color || accent }}
                      >
                        {r.matricula}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{r.empresa}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="font-black text-lg"
                        style={{ color: r.vueltas > 0 ? accent : '#ccc' }}
                      >
                        {r.vueltas > 0 ? r.vueltas : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-xs font-semibold" style={{ color: r.mejorVuelta ? '#555' : '#ccc' }}>
                        {r.mejorVuelta || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: r.velocidadTiempo != null ? accent : '#ccc' }}
                      >
                        {r.velocidadTiempo != null ? formatTime(r.velocidadTiempo) : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: r.frenadoTiempo != null ? accent : '#ccc' }}
                      >
                        {r.frenadoTiempo != null ? formatTime(r.frenadoTiempo) : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
