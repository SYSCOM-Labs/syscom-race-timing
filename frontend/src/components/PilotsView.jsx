import { useState } from 'react';
import {
  Zap, Flame, Sun, Trophy, Shield, Crosshair, Rocket, Wind, Star, Gem, Mountain, Waves,
  Car, Bike, Ship, Plane, RocketIcon, Siren, Radar, Navigation, Compass, LocateFixed,
  Eye, Bolt, Lightbulb, Sparkles, Cloud, Moon, Sunrise, Sunset, Rainbow,
  Leaf, TreePine, Flower2, Cherry, Shell, PawPrint, Bird, Fish, Turtle, Snail, Rabbit,
  Diamond, Crown, Medal, Award, Swords, ShieldCheck, Target, Hash,
  Heart, InfinityIcon, Anchor, Magnet, Key, Lock, Unlock, Globe, Map,
  Activity, Circle, Triangle, Square, Hexagon, Octagon, Pentagon,
  Music, Volume2, Camera, Film, Tv, Watch, Clock, Timer,
  Coffee, Pizza, Cake, Apple, Beer, Wine,
  Laugh, Frown, Meh, Smile, Skull,
} from 'lucide-react';
import usePilots from '../hooks/usePilots.js';
import { THEMES } from '../theme.js';

const LUCIDE_PREFIX = '__lucide__';

const LUCIDE_ICONS = [
  { name: 'Zap', component: Zap },
  { name: 'Flame', component: Flame },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
  { name: 'Star', component: Star },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Cloud', component: Cloud },
  { name: 'Sunrise', component: Sunrise },
  { name: 'Sunset', component: Sunset },
  { name: 'Rainbow', component: Rainbow },
  { name: 'Bolt', component: Bolt },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Eye', component: Eye },
  { name: 'Trophy', component: Trophy },
  { name: 'Medal', component: Medal },
  { name: 'Award', component: Award },
  { name: 'Crown', component: Crown },
  { name: 'Diamond', component: Diamond },
  { name: 'Gem', component: Gem },
  { name: 'Shield', component: Shield },
  { name: 'ShieldCheck', component: ShieldCheck },
  { name: 'Crosshair', component: Crosshair },
  { name: 'Target', component: Target },
  { name: 'Swords', component: Swords },
  { name: 'Rocket', component: Rocket },
  { name: 'RocketIcon', component: RocketIcon },
  { name: 'Car', component: Car },
  { name: 'Bike', component: Bike },
  { name: 'Ship', component: Ship },
  { name: 'Plane', component: Plane },
  { name: 'Compass', component: Compass },
  { name: 'Navigation', component: Navigation },
  { name: 'LocateFixed', component: LocateFixed },
  { name: 'Radar', component: Radar },
  { name: 'Siren', component: Siren },
  { name: 'Anchor', component: Anchor },
  { name: 'Magnet', component: Magnet },
  { name: 'Key', component: Key },
  { name: 'Lock', component: Lock },
  { name: 'Unlock', component: Unlock },
  { name: 'Globe', component: Globe },
  { name: 'Map', component: Map },
  { name: 'Wind', component: Wind },
  { name: 'Mountain', component: Mountain },
  { name: 'Waves', component: Waves },
  { name: 'Leaf', component: Leaf },
  { name: 'TreePine', component: TreePine },
  { name: 'Flower2', component: Flower2 },
  { name: 'Cherry', component: Cherry },
  { name: 'Shell', component: Shell },
  { name: 'PawPrint', component: PawPrint },
  { name: 'Bird', component: Bird },
  { name: 'Fish', component: Fish },
  { name: 'Turtle', component: Turtle },
  { name: 'Snail', component: Snail },
  { name: 'Rabbit', component: Rabbit },
  { name: 'Heart', component: Heart },
  { name: 'InfinityIcon', component: InfinityIcon },
  { name: 'Hash', component: Hash },
  { name: 'Activity', component: Activity },
  { name: 'Circle', component: Circle },
  { name: 'Triangle', component: Triangle },
  { name: 'Square', component: Square },
  { name: 'Hexagon', component: Hexagon },
  { name: 'Octagon', component: Octagon },
  { name: 'Pentagon', component: Pentagon },
  { name: 'Music', component: Music },
  { name: 'Volume2', component: Volume2 },
  { name: 'Camera', component: Camera },
  { name: 'Film', component: Film },
  { name: 'Tv', component: Tv },
  { name: 'Watch', component: Watch },
  { name: 'Clock', component: Clock },
  { name: 'Timer', component: Timer },
  { name: 'Coffee', component: Coffee },
  { name: 'Pizza', component: Pizza },
  { name: 'Cake', component: Cake },
  { name: 'Apple', component: Apple },
  { name: 'Beer', component: Beer },
  { name: 'Wine', component: Wine },
  { name: 'Smile', component: Smile },
  { name: 'Laugh', component: Laugh },
  { name: 'Frown', component: Frown },
  { name: 'Meh', component: Meh },
  { name: 'Skull', component: Skull },
];

const LUCIDE_COMPONENT_MAP = Object.fromEntries(
  LUCIDE_ICONS.map(({ name, component }) => [name, component])
);

const EMOJIS = ['🏎️','🚀','⚡','☀️','🌵','🦅','🐉','🐆','🦊','🐺','🔥','🌊','⛰️','🛡️','🎯','👑','💎','🪐','🌀','🌪️'];

const COLORES = [
  '#ea2d45','#2c46a3','#22c55e','#f59e0b','#8b5cf6',
  '#ec4899','#06b6d4','#f97316','#6366f1','#14b8a6',
];

function isLucideIcon(value) {
  return typeof value === 'string' && value.startsWith(LUCIDE_PREFIX);
}

function getLucideName(value) {
  return value.replace(LUCIDE_PREFIX, '');
}

function renderIcon(value, className = 'w-10 h-10') {
  if (isLucideIcon(value)) {
    const name = getLucideName(value);
    const IconComp = LUCIDE_COMPONENT_MAP[name];
    if (IconComp) return <IconComp className={className} />;
  }
  return <span className="text-4xl">{value || '🏎️'}</span>;
}

function EmptyCard({ onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:shadow-md cursor-pointer min-h-[300px]"
      style={{ borderColor: accent + '40', color: accent }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accent + '15' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </div>
      <span className="text-sm font-bold">Agregar Piloto</span>
    </button>
  );
}

function LicensePlate({ matricula, color }) {
  return (
    <div className="flex flex-col items-center justify-between bg-gradient-to-b from-gray-50 to-gray-200 border-2 border-gray-300 rounded-lg py-2 px-3 relative shadow select-none w-full"
         style={{
           boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.12)',
         }}>
      {/* Tornillos */}
      <span className="absolute top-1.5 left-2.5 w-1.5 h-1.5 rounded-full bg-gray-500 border border-gray-400 shadow-inner" />
      <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 rounded-full bg-gray-500 border border-gray-400 shadow-inner" />
      
      {/* Texto Reto Solar */}
      <span className="text-[8px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: color }}>
        RETO SOLAR
      </span>

      {/* Matrícula */}
      <span className="text-base font-black font-mono tracking-widest text-gray-800 leading-none pb-0.5 drop-shadow-[0.5px_0.5px_0px_white] truncate max-w-full text-center">
        {matricula}
      </span>
    </div>
  );
}

function PilotCard({ pilot, onEdit, onDelete }) {
  const color = pilot.color || '#ea2d45';

  return (
    <div
      className="bg-card-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md group flex flex-col items-center min-h-[300px] relative"
      style={{ borderColor: color + '30' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={() => onEdit(pilot)}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/90 shadow-sm text-gray-400 hover:text-gray-700 hover:bg-white hover:scale-110 active:scale-90 cursor-pointer transition-all duration-150"
          title="Editar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </button>
        <button
          onClick={() => onDelete(pilot.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/90 shadow-sm text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110 active:scale-90 cursor-pointer transition-all duration-150"
          title="Eliminar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-4 w-full">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
          style={{ backgroundColor: color + '15', color: color }}
        >
          {isLucideIcon(pilot.icono)
            ? renderIcon(pilot.icono, 'w-10 h-10')
            : <span className="text-4xl">{pilot.icono || '🏎️'}</span>}
        </div>

        <p className="text-lg font-black text-gray-800 text-center leading-tight mb-1">
          {pilot.piloto}
        </p>

        <p className="text-xs text-gray-400 text-center mb-3">
          {pilot.empresa}
        </p>
      </div>

      <div className="w-full px-5 pb-4 pt-2">
        <LicensePlate matricula={pilot.matricula} color={color} />
      </div>
    </div>
  );
}

function ModalForm({ pilot, onSave, onCancel, accent }) {
  const isEditing = !!pilot;
  const [matricula, setMatricula] = useState(pilot?.matricula || '');
  const [piloto, setPiloto] = useState(pilot?.piloto || '');
  const [empresa, setEmpresa] = useState(pilot?.empresa || '');
  const [color, setColor] = useState(pilot?.color || COLORES[0]);
  const [icono, setIcono] = useState(pilot?.icono || EMOJIS[0]);
  const [iconTab, setIconTab] = useState(isLucideIcon(pilot?.icono) ? 'lucide' : 'emoji');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!matricula.trim() || !piloto.trim() || !empresa.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setError('');
    onSave({ matricula: matricula.trim(), piloto: piloto.trim(), empresa: empresa.trim(), color, icono });
  };

  const currentDefaultEmoji = EMOJIS[0];
  const currentDefaultLucide = LUCIDE_PREFIX + LUCIDE_ICONS[0].name;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-card-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color + '20', color }}
          >
            {isLucideIcon(icono)
              ? renderIcon(icono, 'w-5 h-5')
              : <span className="text-lg">{icono}</span>}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Editar Piloto' : 'Nuevo Piloto'}</h3>
            <p className="text-xs text-gray-400">{isEditing ? 'Modifica los datos del piloto' : 'Registra un nuevo participante'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Matrícula</label>
            <input
              value={matricula}
              onChange={e => setMatricula(e.target.value)}
              placeholder="Ej. CUERVO-4.0"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Nombre del Piloto</label>
            <input
              value={piloto}
              onChange={e => setPiloto(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Empresa / Universidad</label>
            <input
              value={empresa}
              onChange={e => setEmpresa(e.target.value)}
              placeholder="Ej. Universidad Tecnológica"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2">Color Personalizado</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COLORES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `3px solid ${c}` : '3px solid transparent',
                    outlineOffset: '2px',
                    boxShadow: color === c ? `0 0 0 2px white, 0 0 0 5px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
              />
              <span className="text-xs text-gray-400 font-mono">{color}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider">Icono</label>
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => { setIconTab('emoji'); if (isLucideIcon(icono)) setIcono(currentDefaultEmoji); }}
                  className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                    iconTab === 'emoji' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Emojis
                </button>
                <button
                  type="button"
                  onClick={() => { setIconTab('lucide'); if (!isLucideIcon(icono)) setIcono(currentDefaultLucide); }}
                  className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                    iconTab === 'lucide' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Íconos
                </button>
              </div>
            </div>

            {iconTab === 'emoji' ? (
              <div className="max-h-48 overflow-y-auto p-1 -mx-1">
                <div className="grid grid-cols-7 gap-1.5">
                  {EMOJIS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcono(ic)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                      style={{
                        backgroundColor: icono === ic ? color + '20' : 'transparent',
                        outline: icono === ic ? `2px solid ${color}` : '2px solid transparent',
                        outlineOffset: '-1px',
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto p-1 -mx-1">
                <div className="grid grid-cols-7 gap-1.5">
                  {LUCIDE_ICONS.map(({ name, component: IconComp }) => {
                    const val = LUCIDE_PREFIX + name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setIcono(val)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                        style={{
                          backgroundColor: icono === val ? color + '20' : 'transparent',
                          outline: icono === val ? `2px solid ${color}` : '2px solid transparent',
                          outlineOffset: '-1px',
                          color: icono === val ? color : '#666',
                        }}
                      >
                        <IconComp className="w-[18px] h-[18px]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer hover:bg-gray-50 active:scale-98"
              style={{ color: accent, borderColor: accent + '40' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-sm cursor-pointer hover:opacity-90 active:scale-98"
              style={{ backgroundColor: accent }}
            >
              {isEditing ? 'Guardar Cambios' : 'Agregar Piloto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PilotsView({ themeMode }) {
  const accent = THEMES[themeMode].accent;
  const { pilots, create, update, remove } = usePilots();
  const [editingPilot, setEditingPilot] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data) => {
    if (editingPilot) update(editingPilot.id, data);
    else create(data);
    setShowForm(false);
    setEditingPilot(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Pilotos</h2>
          <p className="text-xs text-gray-400">{pilots.length} piloto{pilots.length !== 1 ? 's' : ''} registrado{pilots.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditingPilot(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer hover:scale-[1.02] hover:opacity-90 active:scale-98"
          style={{ backgroundColor: accent }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nuevo Piloto
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {pilots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: accent + '10', color: accent }}>
              <Zap className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">No hay pilotos registrados</p>
            <p className="text-xs mt-1">Presiona "Nuevo Piloto" para agregar el primero</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <EmptyCard onClick={() => { setEditingPilot(null); setShowForm(true); }} accent={accent} />
            {pilots.map(pilot => (
              <PilotCard
                key={pilot.id}
                pilot={pilot}
                onEdit={(p) => { setEditingPilot(p); setShowForm(true); }}
                onDelete={(id) => {
                  const p = pilots.find(x => x.id === id);
                  if (window.confirm(`¿Eliminar a ${p?.piloto || 'este piloto'}?`)) remove(id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ModalForm
          pilot={editingPilot}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingPilot(null); }}
          accent={accent}
        />
      )}
    </div>
  );
}
