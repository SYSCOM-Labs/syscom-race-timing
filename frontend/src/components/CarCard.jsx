import { memo } from 'react';
import { THEMES } from '../theme.js';

const STATUS_CONFIG = {
  active: { label: 'En Pista', color: '#22c55e' },
  pit: { label: 'Pit Lane', color: '#f59e0b' },
  'pit-stop': { label: 'Pit Stop', color: '#ef4444' },
};

function CarSvg({ color }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17a2 2 0 0 1-2-2v-4l2.5-4.5A2 2 0 0 1 7.3 6h9.4a2 2 0 0 1 1.8 1.1L21 11v4a2 2 0 0 1-2 2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <line x1="5" y1="11" x2="19" y2="11" />
    </svg>
  );
}

function PositionBadge({ position, isLeader }) {
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0
      ${isLeader ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
      {isLeader ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ) : (
        position
      )}
    </div>
  );
}

function CarCard({ auto, position, isLeader, themeMode }) {
  const accent = THEMES[themeMode].accent;
  const status = STATUS_CONFIG[auto.status] || STATUS_CONFIG.active;

  return (
    <div className={`bg-card-white rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden
      ${isLeader ? 'ring-2 ring-amber-400' : 'border border-gray-100'}`}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <PositionBadge position={position} isLeader={isLeader} />
          <div className="flex-1 min-w-0 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-gray-800 truncate">{auto.matricula}</span>
                {isLeader && (
                  <span className="text-[8px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Líder
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{auto.equipo}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
              <span className="text-[9px] font-semibold text-gray-400 uppercase">{status.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
               style={{ backgroundColor: accent + '10' }}>
            <CarSvg color={accent} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-medium">Vueltas</span>
            <span className="text-2xl font-black leading-none" style={{ color: accent }}>
              {auto.vueltas}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Última</span>
            <span className="text-[11px] font-mono font-bold text-gray-700">{auto.ultimaVuelta}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Mejor</span>
            <span className="text-[11px] font-mono font-bold text-green-600">{auto.mejorVuelta}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Vel. Máx</span>
            <span className="text-[11px] font-mono font-bold text-gray-700">{auto.velocidadMaxima} <span className="text-[9px] text-gray-400">km/h</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Frenado</span>
            <span className="text-[11px] font-mono font-bold text-gray-700">{auto.frenadoMetros} <span className="text-[9px] text-gray-400">m</span></span>
          </div>
        </div>
      </div>

      {isLeader && (
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)' }} />
      )}
    </div>
  );
}

export default memo(CarCard);
