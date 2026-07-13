import { useState, useMemo, useRef, useEffect } from 'react';
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
  Search, ArrowUpDown, ArrowUp, ArrowDown, BarChart3, Users, ZapIcon, Gauge
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

function HighlightText({ text, query }) {
  if (!query || !query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-yellow-950 font-bold px-1 rounded shadow-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function RecordsView({ autos, themeMode }) {
  const accent = THEMES[themeMode].accent;
  const { pilots } = usePilots();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('vueltas');
  const [sortAsc, setSortAsc] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const maxVueltas = useMemo(() => Math.max(...records.map(r => r.vueltas), 1), [records]);
  const maxSpeedTime = useMemo(() => Math.min(...records.map(r => r.velocidadTiempo || Infinity)), [records]);
  const activePilots = useMemo(() => records.filter(r => r.vueltas > 0 || r.velocidadTiempo || r.frenadoTiempo).length, [records]);

  return (
    <div className="h-full flex flex-col gap-6 p-2">
      {/* Cards de resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pilotos Activos</p>
            <h3 className="text-3xl font-black text-gray-800">{activePilots} <span className="text-lg text-gray-400 font-medium">/ {records.length}</span></h3>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: accent + '15', color: accent }}>
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Máx. Vueltas</p>
            <h3 className="text-3xl font-black text-gray-800">{maxVueltas === 1 ? 0 : maxVueltas}</h3>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: accent + '15', color: accent }}>
            <Activity className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Mejor T. Velocidad</p>
            <h3 className="text-3xl font-black text-gray-800">{maxSpeedTime === Infinity ? '—' : formatTime(maxSpeedTime)}</h3>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: accent + '15', color: accent }}>
            <ZapIcon className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Contenedor Principal de la Tabla */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex-1 flex flex-col overflow-hidden">
        
        {/* Header con Buscador y Filtros */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-96 group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-gray-800' : 'text-gray-400'}`}>
              <Search className="h-5 w-5" />
            </div>
            <input
              ref={searchInputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Buscar por piloto, matrícula o empresa..."
              className="block w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:border-transparent transition-all duration-300 shadow-sm"
              style={{
                boxShadow: isFocused ? `0 0 0 4px ${accent}20` : undefined,
                borderColor: isFocused ? accent : undefined
              }}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); searchInputRef.current?.focus(); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors">
                  &times;
                </div>
              </button>
            )}
            {!search && !isFocused && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-md border border-gray-200 shadow-sm">Ctrl K</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mr-2 whitespace-nowrap flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Ordenar:
            </span>
            {[
              { key: 'vueltas', label: 'Vueltas', icon: Activity },
              { key: 'velocidad', label: 'Velocidad', icon: ZapIcon },
              { key: 'frenado', label: 'Frenado', icon: Gauge },
            ].map(({ key, label, icon: Icon }) => {
              const isActive = sortKey === key;
              return (
                <button
                  key={key}
                  onClick={() => toggleSort(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer active:scale-95 transition-all duration-300 border ${
                    isActive ? 'border-transparent text-white shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: isActive ? accent : undefined }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                  {label}
                  <span className="ml-1 opacity-80">
                    {isActive && getSortIcon(sortKey, key, sortAsc)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabla / Grid */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr>
                <th className="py-4 px-6 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest w-16">Rank</th>
                <th className="py-4 px-6 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Piloto / Equipo</th>
                <th className="py-4 px-6 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estadísticas Carrera</th>
                <th className="py-4 px-6 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pruebas Especiales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium text-gray-600 mb-1">No se encontraron resultados</p>
                      <p className="text-sm">Intenta con un término de búsqueda diferente.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((r, i) => {
                const isFirst = i === 0 && sortKey === 'vueltas';
                const hasVueltas = r.vueltas > 0;
                
                return (
                  <tr
                    key={r.id}
                    className="group bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] relative cursor-pointer"
                  >
                    {/* Rank */}
                    <td className="py-5 px-6 relative">
                      {isFirst && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-md" style={{ backgroundColor: accent }}></div>
                      )}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full font-black text-sm" style={{ 
                        backgroundColor: isFirst ? accent + '20' : 'transparent',
                        color: isFirst ? accent : '#a1a1aa'
                      }}>
                        {isFirst ? <Trophy className="w-4 h-4" /> : `#${i + 1}`}
                      </div>
                    </td>

                    {/* Piloto / Equipo */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: (r.color || accent) + '15', color: r.color || accent }}
                        >
                          {renderIcon(r.icono, 'w-6 h-6')}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base mb-1">
                            <HighlightText text={r.piloto} query={search} />
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span
                              className="font-black px-2.5 py-0.5 rounded-md text-white shadow-sm"
                              style={{ backgroundColor: r.color || accent }}
                            >
                              <HighlightText text={r.matricula} query={search} />
                            </span>
                            <span className="text-gray-500 font-medium">
                              <HighlightText text={r.empresa} query={search} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Estadísticas Carrera */}
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-3 max-w-[200px]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-500 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> Vueltas
                          </span>
                          <span className="font-black text-sm" style={{ color: hasVueltas ? accent : '#d4d4d8' }}>
                            {hasVueltas ? r.vueltas : '0'}
                          </span>
                        </div>
                        
                        {/* Barra de progreso de vueltas */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out relative"
                            style={{ 
                              width: `${hasVueltas ? (r.vueltas / maxVueltas) * 100 : 0}%`,
                              backgroundColor: accent 
                            }}
                          >
                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="font-bold text-gray-500 flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5" /> Mejor Vuelta
                          </span>
                          <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            {r.mejorVuelta || '--:--.---'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Pruebas Especiales */}
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-2.5 items-center justify-center">
                        {/* Velocidad */}
                        <div className="flex items-center gap-3 w-40 justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 transition-colors group-hover:bg-white group-hover:border-gray-200">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                            <ZapIcon className="w-4 h-4 text-orange-500" />
                            Vel
                          </div>
                          <span className="font-mono font-black text-sm" style={{ color: r.velocidadTiempo != null ? accent : '#d4d4d8' }}>
                            {r.velocidadTiempo != null ? formatTime(r.velocidadTiempo) : '—'}
                          </span>
                        </div>

                        {/* Frenado */}
                        <div className="flex items-center gap-3 w-40 justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 transition-colors group-hover:bg-white group-hover:border-gray-200">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                            <Gauge className="w-4 h-4 text-red-500" />
                            Fre
                          </div>
                          <span className="font-mono font-black text-sm" style={{ color: r.frenadoTiempo != null ? accent : '#d4d4d8' }}>
                            {r.frenadoTiempo != null ? formatTime(r.frenadoTiempo) : '—'}
                          </span>
                        </div>
                      </div>
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
