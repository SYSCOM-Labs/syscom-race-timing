import CarCard, { STANDINGS_COLS } from './CarCard.jsx';
import CameraPanel from './CameraPanel.jsx';
import { THEMES } from '../theme.js';

function CircularTimer({ cronometro, remainingMs, totalMs, accent }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, 1 - remainingMs / totalMs));
  const dashoffset = circumference * (1 - progress);
  const pct = Math.round(progress * 100);
  const isCritical = progress > 0.9;
  const ringColor = isCritical ? '#ef4444' : accent;

  return (
    <div className="h-full w-full bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 shrink-0">
        Cronómetro
      </p>

      <div className="relative w-full max-w-[210px] aspect-square">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="9" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Restante</span>
          <span
            className="text-2xl xl:text-3xl font-black font-mono tracking-tight tabular-nums leading-none mt-1"
            style={{ color: ringColor }}
          >
            {cronometro}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isCritical ? '#ef4444' : accent }}
            />
            <span className="text-[10px] text-gray-400 font-medium tabular-nums">{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderCard({ leader, accent }) {
  if (!leader) {
    return (
      <div className="h-full w-full bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm flex items-center justify-center p-4">
        <p className="text-sm text-gray-400 text-center">Sin líder aún</p>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full rounded-2xl border-2 shadow-sm flex flex-col p-4 overflow-hidden"
      style={{
        borderColor: '#fbbf24',
        background: 'linear-gradient(160deg, #fffbeb 0%, #ffffff 55%)',
      }}
    >
      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest shrink-0">
        Auto líder
      </p>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center gap-2">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: accent + '18', color: accent }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <div className="min-w-0 w-full px-1">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-gray-400">#{leader.id}</span>
            <span className="text-base font-black text-gray-800 truncate max-w-full">{leader.matricula}</span>
          </div>
          <p className="text-[11px] text-gray-500 truncate mt-0.5">{leader.equipo}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full mt-1 pt-2 border-t border-amber-200/60">
          <div>
            <p className="text-lg font-black leading-none tabular-nums" style={{ color: accent }}>
              {leader.vueltas}
            </p>
            <p className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">vueltas</p>
          </div>
          <div>
            <p className="text-xs font-mono font-bold text-gray-700 leading-none mt-1">{leader.mejorVuelta}</p>
            <p className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">mejor</p>
          </div>
          <div>
            <p className="text-xs font-mono font-bold text-gray-700 leading-none mt-1">{leader.velocidadMaxima}</p>
            <p className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnduranceView({ autos, cronometro, remainingMs, totalMs, leader, themeMode }) {
  const accent = THEMES[themeMode].accent;

  return (
    <div className="h-full min-h-0 flex flex-col gap-3 overflow-hidden">
      {/* Top: chrono (25%) + leader (25%) + camera (50%) */}
      <div className="shrink-0 grid grid-cols-[1fr_1fr_2fr] gap-3 h-[260px] xl:h-[300px]">
        <CircularTimer
          cronometro={cronometro}
          remainingMs={remainingMs}
          totalMs={totalMs}
          accent={accent}
        />
        <LeaderCard leader={leader} accent={accent} />
        <CameraPanel accent={accent} />
      </div>

      {/* Standings */}
      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-2 pt-3 pb-2 border-b border-gray-100 shrink-0">
          <div className="px-3 mb-2">
            <p className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">Posiciones</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Ordenadas por vueltas</p>
          </div>
          <div
            className="grid items-center gap-x-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: STANDINGS_COLS }}
          >
            <span className="text-center">Pos</span>
            <span className="text-center">#</span>
            <span className="text-center">Matrícula</span>
            <span className="text-center">Rol</span>
            <span className="text-center">Equipo</span>
            <span className="text-center">Vueltas</span>
            <span className="text-center">Última</span>
            <span className="text-center">Mejor</span>
            <span className="text-center">Vel.</span>
            <span className="text-center">Freno</span>
            <span className="text-center">Estado</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
          {autos.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Sin participantes en pista
            </div>
          ) : (
            autos.map((auto, index) => (
              <CarCard
                key={auto.id}
                auto={auto}
                position={index + 1}
                isLeader={index === 0 && !!leader}
                themeMode={themeMode}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
