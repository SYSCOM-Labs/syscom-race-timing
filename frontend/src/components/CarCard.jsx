import { memo } from 'react';
import { THEMES } from '../theme.js';

const STATUS_CONFIG = {
  active: { label: 'En Pista', color: '#22c55e' },
  pit: { label: 'Pit Lane', color: '#f59e0b' },
  'pit-stop': { label: 'Pit Stop', color: '#ef4444' },
};

function LicensePlate({ matricula, accent }) {
  return (
    <div className="inline-flex flex-col items-center justify-between bg-gradient-to-b from-gray-50 to-gray-200 border-2 border-gray-300 rounded-lg py-1.5 px-3 relative shadow select-none min-w-[95px]"
         style={{
           boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.12)',
         }}>
      {/* Tornillos */}
      <span className="absolute top-1.5 left-2.5 w-1.5 h-1.5 rounded-full bg-gray-500 border border-gray-400 shadow-inner" />
      <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 rounded-full bg-gray-500 border border-gray-400 shadow-inner" />
      
      {/* Texto Reto Solar */}
      <span className="text-[7px] font-black uppercase tracking-widest leading-none mb-1.5 animate-pulse" style={{ color: accent }}>
        RETO SOLAR
      </span>

      {/* Matrícula */}
      <span className="text-sm font-black font-mono tracking-widest text-gray-800 leading-none pb-0.5 drop-shadow-[0.5px_0.5px_0px_white]">
        {matricula}
      </span>
    </div>
  );
}

function CarCard({ auto, themeMode }) {
  const accent = THEMES[themeMode].accent;
  const status = STATUS_CONFIG[auto.status] || STATUS_CONFIG.active;

  return (
    <div className="bg-card-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <LicensePlate matricula={auto.matricula} accent={accent} />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
            <span className="text-[10px] font-medium text-gray-400 uppercase">{status.label}</span>
          </div>
        </div>
        <span className="text-[10px] text-gray-300 font-mono">#{auto.id}</span>
      </div>

      <p className="text-sm font-semibold text-gray-700 mb-3 truncate">{auto.equipo}</p>

      <div className="text-center mb-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Vueltas</p>
        <p className="text-4xl font-black leading-none" style={{ color: accent }}>
          {auto.vueltas}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Última Vuelta</p>
          <p className="font-mono font-semibold text-gray-700">{auto.ultimaVuelta}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Mejor Vuelta</p>
          <p className="font-mono font-semibold text-gray-700">{auto.mejorVuelta}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Vel. Máx.</p>
          <p className="font-mono font-semibold text-gray-700">{auto.velocidadMaxima} km/h</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Frenado</p>
          <p className="font-mono font-semibold text-gray-700">{auto.frenadoMetros} m</p>
        </div>
      </div>
    </div>
  );
}

export default memo(CarCard);
