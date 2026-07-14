import CarCard from './CarCard.jsx';
import { THEMES } from '../theme.js';

function CircularTimer({ cronometro, remainingMs, totalMs, accent }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const progress = 1 - remainingMs / totalMs;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Cronómetro</p>
      <div className="relative w-[180px] h-[180px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={accent}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className="transition-all duration-1000 ease-linear"
            style={{ opacity: 0.8 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Restante</span>
          <span className="text-2xl font-black font-mono tracking-tight" style={{ color: accent }}>
            {cronometro}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: progress > 0.75 ? '#ef4444' : accent }} />
            <span className="text-[10px] text-gray-400 font-medium">{Math.round(progress * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderCard({ leader, accent }) {
  if (!leader) return null;

  return (
    <div className="h-full flex flex-col justify-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Auto Líder</p>
      <div className="rounded-2xl border-2 overflow-hidden transition-all duration-300"
           style={{ borderColor: '#fbbf24', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}>
        <div className="p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg"
               style={{ backgroundColor: accent + '20', color: accent }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gray-400 font-mono">#{leader.id}</span>
              <span className="text-base font-black text-gray-800 truncate">{leader.matricula}</span>
              <span className="text-[9px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{ backgroundColor: '#f59e0b' }}>
                Líder
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{leader.equipo}</p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px]">
              <span className="font-bold text-gray-700">{leader.vueltas} vueltas</span>
              <span className="text-gray-300">|</span>
              <span className="font-mono text-gray-600 font-semibold">Mejor {leader.mejorVuelta}</span>
              <span className="text-gray-300">|</span>
              <span className="font-mono text-gray-600 font-semibold">{leader.velocidadMaxima} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar({ autos }) {
  const active = autos.filter(a => a.status === 'active').length;
  const pit = autos.filter(a => a.status === 'pit').length;
  const pitStop = autos.filter(a => a.status === 'pit-stop').length;

  return (
    <div className="flex items-center gap-4 px-1">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-[11px] font-medium text-gray-500">{active} En Pista</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-[11px] font-medium text-gray-500">{pit} Pit Lane</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-[11px] font-medium text-gray-500">{pitStop} Pit Stop</span>
      </div>
    </div>
  );
}

export default function EnduranceView({ autos, cronometro, remainingMs, totalMs, leader, themeMode }) {
  const accent = THEMES[themeMode].accent;

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-[220px] shrink-0 bg-card-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-center">
          <CircularTimer cronometro={cronometro} remainingMs={remainingMs} totalMs={totalMs} accent={accent} />
        </div>
        <div className="flex-1 bg-card-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <LeaderCard leader={leader} accent={accent} />
        </div>
      </div>

      <div className="bg-card-white rounded-2xl p-3 shadow-sm border border-gray-100">
        <StatusBar autos={autos} />
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {autos.map((auto, index) => (
            <CarCard key={auto.id} auto={auto} position={index + 1} isLeader={index === 0 && leader} themeMode={themeMode} />
          ))}
        </div>
      </div>
    </div>
  );
}
