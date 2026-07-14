export default function CameraDetectionCard({ detection, accent }) {
  if (!detection) {
    return (
      <div className="h-full w-full bg-white/70 rounded-2xl border border-dashed border-gray-200 shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-1.5">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <p className="text-[10px] text-gray-300 font-medium">Esperando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between p-4 transition-all duration-300 hover:shadow-md overflow-hidden group">
      
      {/* Barra superior de acento táctico para identificar el auto/estado */}
      <div className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300" 
           style={{ backgroundColor: accent }} />

      {/* 1. Encabezado de Hardware: Diagnóstico y Origen de la Trama */}
      <div className="flex items-center justify-between w-full mb-2">
      </div>

      {/* 2. Cuerpo Principal: Identificación Asimétrica de Alto Impacto */}
      <div className="flex-1 flex flex-col justify-center my-2">
        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">MATRICULA</div>
        <h4 className="font-black text-2xl tracking-tight leading-none text-gray-900 truncate group-hover:scale-[1.01] origin-left transition-transform duration-200">
          {detection.matricula}
        </h4>
        
        {/* Contador de Vueltas Integrado */}
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-black tracking-tighter tabular-nums leading-none" style={{ color: accent }}>
            {detection.vuelta}
          </span>
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest font-mono"> Vuelta</span>
        </div>
      </div>

      {/* 3. Footer: Grid de Métricas Críticas (Tipografía Mono para Datos) */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 w-full mt-auto">
        <div className="flex flex-col justify-end">
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 font-mono">Lap Time</span>
          <span className="text-[15px] font-mono font-bold text-gray-800 tabular-nums leading-tight tracking-tight mt-0.5">
            {detection.tiempoVuelta}
          </span>
        </div>
        
        <div className="flex flex-col justify-end pl-3 border-l border-gray-100">
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 font-mono">Radar Vel.</span>
          <span className="text-[15px] font-mono font-bold text-gray-800 tabular-nums leading-tight tracking-tight mt-0.5 flex items-baseline gap-0.5">
            {detection.velocidad}
            <span className="text-[9px] text-gray-400 font-sans font-bold uppercase tracking-normal">km/h</span>
          </span>
        </div>
      </div>

    </div>
  );
}
