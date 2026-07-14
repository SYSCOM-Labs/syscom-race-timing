import { memo } from 'react';
import { THEMES } from '../theme.js';

const STATUS_CONFIG = {
  active: { label: 'En Pista', color: '#22c55e', bg: '#f0fdf4' },
  pit: { label: 'Pit Lane', color: '#f59e0b', bg: '#fffbeb' },
  'pit-stop': { label: 'Pit Stop', color: '#ef4444', bg: '#fef2f2' },
};

function CarCard({ auto, position, isLeader, themeMode }) {
  const accent = THEMES[themeMode].accent;
  const status = STATUS_CONFIG[auto.status] || STATUS_CONFIG.active;

  return (
    <div
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors duration-150',
        isLeader
          ? 'bg-amber-50/80 border-amber-300'
          : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200',
      ].join(' ')}
    >
      {/* Position */}
      <div
        className={[
          'w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0',
          isLeader ? 'bg-amber-400 text-white shadow-sm' : 'bg-gray-100 text-gray-500',
        ].join(' ')}
      >
        {isLeader ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ) : (
          position
        )}
      </div>

      {/* Car + team */}
      <div className="min-w-0 flex-[1.3]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-mono font-bold text-gray-400 shrink-0">#{auto.id}</span>
          <span className="text-sm font-black text-gray-800 truncate">{auto.matricula}</span>
          {isLeader && (
            <span className="text-[8px] font-black text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
              Líder
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 truncate">{auto.equipo}</p>
      </div>

      {/* Laps */}
      <div className="w-14 shrink-0 text-center">
        <p className="text-xl font-black leading-none tabular-nums" style={{ color: accent }}>
          {auto.vueltas}
        </p>
        <p className="text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">vueltas</p>
      </div>

      {/* Times */}
      <div className="hidden sm:block min-w-[7.5rem] shrink-0 space-y-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-gray-400">Última</span>
          <span className="text-xs font-mono font-bold text-gray-700">{auto.ultimaVuelta}</span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-gray-400">Mejor</span>
          <span className="text-xs font-mono font-bold text-green-600">{auto.mejorVuelta}</span>
        </div>
      </div>

      {/* Telemetry */}
      <div className="hidden lg:block min-w-[6.5rem] shrink-0 space-y-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-gray-400">Vel.</span>
          <span className="text-xs font-mono font-bold text-gray-700">
            {auto.velocidadMaxima}
            <span className="text-[9px] font-medium text-gray-400"> km/h</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-gray-400">Freno</span>
          <span className="text-xs font-mono font-bold text-gray-700">
            {auto.frenadoMetros}
            <span className="text-[9px] font-medium text-gray-400"> m</span>
          </span>
        </div>
      </div>

      {/* Status */}
      <div
        className="ml-auto shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg"
        style={{ backgroundColor: status.bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: status.color }} />
        <span className="text-[10px] font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

export default memo(CarCard);
