import { memo } from 'react';
import { THEMES } from '../theme.js';

export const STATUS_CONFIG = {
  active: { label: 'En Pista', color: '#22c55e', bg: '#f0fdf4' },
  pit: { label: 'Pit Lane', color: '#f59e0b', bg: '#fffbeb' },
  'pit-stop': { label: 'Pit Stop', color: '#ef4444', bg: '#fef2f2' },
};

/** Shared with EnduranceView header so titles line up with cells */
export const STANDINGS_COLS =
  '2.75rem 2.5rem minmax(5.5rem, 0.85fr) 3.25rem minmax(7rem, 1.15fr) 4.5rem 5.75rem 5.75rem 4.75rem 4rem 6.75rem';

function CarCard({ auto, position, isLeader, themeMode }) {
  const accent = THEMES[themeMode].accent;
  const status = STATUS_CONFIG[auto.status] || STATUS_CONFIG.active;

  return (
    <div
      className={[
        'grid items-center gap-x-2 px-3 py-2.5 rounded-xl border transition-colors duration-150',
        isLeader
          ? 'bg-amber-50/80 border-amber-300'
          : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200',
      ].join(' ')}
      style={{ gridTemplateColumns: STANDINGS_COLS }}
    >
      <div className="flex justify-center">
        <div
          className={[
            'w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm',
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
      </div>

      <div className="text-center">
        <span className="text-xs font-mono font-bold text-gray-400">#{auto.id}</span>
      </div>

      <div className="min-w-0 text-center">
        <span className="text-sm font-black text-gray-800 truncate block">{auto.matricula}</span>
      </div>

      <div className="flex justify-center">
        {isLeader ? (
          <span className="text-[8px] font-black text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
            Líder
          </span>
        ) : (
          <span className="text-[10px] text-gray-200">—</span>
        )}
      </div>

      <div className="min-w-0 text-center">
        <span className="text-[11px] text-gray-500 truncate block">{auto.equipo}</span>
      </div>

      <div className="text-center">
        <p className="text-xl font-black leading-none tabular-nums" style={{ color: accent }}>
          {auto.vueltas}
        </p>
      </div>

      <div className="text-center">
        <span className="text-xs font-mono font-bold text-gray-700 tabular-nums">{auto.ultimaVuelta}</span>
      </div>

      <div className="text-center">
        <span className="text-xs font-mono font-bold text-green-600 tabular-nums">{auto.mejorVuelta}</span>
      </div>

      <div className="text-center">
        <span className="text-xs font-mono font-bold text-gray-700 tabular-nums">
          {auto.velocidadMaxima}
          <span className="text-[9px] font-medium text-gray-400"> km/h</span>
        </span>
      </div>

      <div className="text-center">
        <span className="text-xs font-mono font-bold text-gray-700 tabular-nums">
          {auto.frenadoMetros}
          <span className="text-[9px] font-medium text-gray-400"> m</span>
        </span>
      </div>

      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{ backgroundColor: status.bg }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: status.color }} />
          <span
            className="text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: status.color }}
          >
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(CarCard);
