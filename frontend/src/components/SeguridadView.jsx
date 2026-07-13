import { useState, useMemo } from 'react';
import usePilots from '../hooks/usePilots.js';
import useSeguridad from '../hooks/useSeguridad.js';
import { THEMES } from '../theme.js';
import { renderIcon, isLucideIcon, LUCIDE_PREFIX } from '../utils/iconRenderer.jsx';

const FIELDS = [
  { key: 'casco', label: 'Casco' },
  { key: 'cinturon', label: 'Cinturón' },
  { key: 'puntosEmpuje', label: 'Empuje' },
  { key: 'paroEmergencia', label: 'Paro Emerg.' },
];

function SafetyIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SeguridadCard({ pilot, status, onClick }) {
  const color = pilot.color || '#ea2d45';
  const items = status || { casco: false, cinturon: false, puntosEmpuje: false, paroEmergencia: false };
  const allComplete = items.casco && items.cinturon && items.puntosEmpuje && items.paroEmergencia;
  const completedCount = [items.casco, items.cinturon, items.puntosEmpuje, items.paroEmergencia].filter(Boolean).length;

  return (
    <button
      onClick={() => onClick(pilot)}
      className="bg-card-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer text-left w-full flex flex-col"
      style={{ border: `2px solid ${allComplete ? '#22c55e' : '#f59e0b'}` }}
    >
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
               style={{ backgroundColor: color + '18', color }}>
            {renderIcon(pilot.icono, 'w-[18px] h-[18px]')}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 leading-tight truncate">{pilot.piloto}</p>
            <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded inline-block mt-0.5"
                  style={{ backgroundColor: color }}>
              {pilot.matricula}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 mt-3">
          {FIELDS.map(({ key, label }) => {
            const ok = items[key];
            return (
              <div key={key} className="flex items-center gap-2 text-xs">
                <div className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                  ok ? 'text-white' : 'text-gray-400 bg-gray-100'
                }`} style={{ backgroundColor: ok ? '#22c55e' : undefined }}>
                  <SafetyIcon filled={ok} />
                </div>
                <span className={ok ? 'text-gray-700 font-medium' : 'text-gray-400'}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white text-center ${
        allComplete ? 'bg-green-500' : 'bg-amber-500'
      }`}>
        <span className="flex items-center justify-center gap-1.5">
          <SafetyIcon filled />
          {allComplete ? 'Listo' : `${completedCount}/4 Completado`}
        </span>
      </div>
    </button>
  );
}

function SeguridadModal({ pilot, status, onToggle, onClose }) {
  const color = pilot.color || '#ea2d45';
  const items = status || { casco: false, cinturon: false, puntosEmpuje: false, paroEmergencia: false };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
               style={{ backgroundColor: color + '18', color }}>
            {typeof pilot.icono === 'string' && pilot.icono.startsWith(LUCIDE_PREFIX)
              ? renderIcon(pilot.icono, 'w-5 h-5')
              : <span className="text-lg">{pilot.icono || '🏎️'}</span>}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{pilot.piloto}</h3>
            <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: color }}>{pilot.matricula}</span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">Checklist de Seguridad</p>

        <div className="space-y-2">
          {[
            { key: 'casco', label: 'Casco', desc: 'Verificar casco reglamentario' },
            { key: 'cinturon', label: 'Cinturón de Seguridad', desc: 'Cinturón de 5 puntos abrochado' },
            { key: 'puntosEmpuje', label: 'Puntos de Empuje y Arrastre', desc: 'Verificar puntos delanteros y traseros' },
            { key: 'paroEmergencia', label: 'Paro de Emergencia', desc: 'Botón de paro accesible y funcional' },
          ].map(({ key, label, desc }) => {
            const checked = items[key];
            return (
              <button
                key={key}
                onClick={() => onToggle(pilot.id, key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  checked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  checked ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {checked ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  )}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${checked ? 'text-green-700' : 'text-gray-700'}`}>{label}</p>
                  <p className="text-[10px] text-gray-400">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm transition-all border"
          style={{ color, borderColor: color + '40' }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function SeguridadView({ themeMode }) {
  const accent = THEMES[themeMode].accent;
  const { pilots } = usePilots();
  const { checks, toggle, isComplete } = useSeguridad();
  const [selectedPilot, setSelectedPilot] = useState(null);

  const sorted = useMemo(() => {
    return [...pilots].sort((a, b) => {
      const ca = isComplete(a.id);
      const cb = isComplete(b.id);
      if (ca && !cb) return 1;
      if (!ca && cb) return -1;
      return 0;
    });
  }, [pilots, isComplete]);

  const readyCount = pilots.filter(p => isComplete(p.id)).length;

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-card-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent + '15', color: accent }}>
            <SafetyIcon filled />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Seguridad</h2>
            <p className="text-xs text-gray-400">Checklist de equipamiento por piloto</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${readyCount === pilots.length && pilots.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="text-sm font-bold text-gray-700">{readyCount}/{pilots.length}</span>
          <span className="text-[10px] text-gray-400">listos</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {pilots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <SafetyIcon filled />
            <p className="text-sm font-medium mt-3">No hay pilotos registrados</p>
            <p className="text-xs mt-1">Agrega pilotos en la sección de Pilotos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map(pilot => (
              <SeguridadCard
                key={pilot.id}
                pilot={pilot}
                status={checks[pilot.id]}
                onClick={setSelectedPilot}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPilot && (
        <SeguridadModal
          pilot={selectedPilot}
          status={checks[selectedPilot.id]}
          onToggle={toggle}
          onClose={() => setSelectedPilot(null)}
        />
      )}
    </div>
  );
}
