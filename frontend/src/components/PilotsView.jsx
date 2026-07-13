import { useState } from 'react';
import usePilots from '../hooks/usePilots.js';
import { THEMES } from '../theme.js';

const ICONOS = ['🏎️','🚀','⚡','☀️','🌵','🦅','🐉','🐆','🦊','🐺','🔥','🌊','⛰️','🛡️','🎯','👑','💎','🪐','🌀','🌪️'];

const COLORES = [
  '#ea2d45','#2c46a3','#22c55e','#f59e0b','#8b5cf6',
  '#ec4899','#06b6d4','#f97316','#6366f1','#14b8a6',
];

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

function PilotCard({ pilot, onEdit, onDelete }) {
  const color = pilot.color || '#ea2d45';

  return (
    <div
      className="bg-card-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md group flex flex-col items-center min-h-[300px] relative"
      style={{ borderColor: color + '30' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={() => onEdit(pilot)}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/90 shadow-sm text-gray-400 hover:text-gray-600 hover:bg-white transition-all"
          title="Editar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </button>
        <button
          onClick={() => onDelete(pilot.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/90 shadow-sm text-gray-400 hover:text-red-500 transition-all"
          title="Eliminar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-4 w-full">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-sm"
          style={{ backgroundColor: color + '15' }}
        >
          {pilot.icono || '🏎️'}
        </div>

        <p className="text-lg font-black text-gray-800 text-center leading-tight mb-1">
          {pilot.piloto}
        </p>

        <p className="text-xs text-gray-400 text-center mb-3">
          {pilot.empresa}
        </p>
      </div>

      <div className="w-full px-5 pb-4 pt-2">
        <span
          className="text-[10px] font-bold text-white px-2.5 py-1 rounded-md block text-center truncate"
          style={{ backgroundColor: color }}
        >
          {pilot.matricula}
        </span>
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
  const [icono, setIcono] = useState(pilot?.icono || ICONOS[0]);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-card-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: color + '20' }}>
            {icono}
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
              style={{ focusRing: `2px solid ${accent}` }}
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
              style={{ focusRing: `2px solid ${accent}` }}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Empresa / Universidad</label>
            <input
              value={empresa}
              onChange={e => setEmpresa(e.target.value)}
              placeholder="Ej. Universidad Tecnológica"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none transition-all"
              style={{ focusRing: `2px solid ${accent}` }}
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
                  className="w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110"
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
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2">Icono</label>
            <div className="flex flex-wrap gap-1.5">
              {ICONOS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcono(ic)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200"
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

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm border transition-all"
              style={{ color: accent, borderColor: accent + '40' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-sm"
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-all duration-200 shadow-sm"
          style={{ backgroundColor: accent }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nuevo Piloto
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {pilots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl" style={{ backgroundColor: accent + '10' }}>
              🏎️
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
