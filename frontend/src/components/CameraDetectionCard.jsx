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
    <div className="h-full w-full bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

      <div className="flex-1 flex flex-col items-center justify-center px-3 gap-0.5">
        <span className="font-black text-sm tracking-wider text-center leading-tight truncate max-w-full"
              style={{ color: accent }}>
          {detection.matricula}
        </span>

        <div className="flex items-baseline gap-0.5 mt-1">
          <span className="text-2xl font-black leading-none tabular-nums" style={{ color: accent }}>
            {detection.vuelta}
          </span>
          <span className="text-[9px] text-gray-400 font-medium ml-0.5">vta</span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-gray-100 w-full justify-center">
          <div className="text-center">
            <p className="text-[10px] font-mono font-bold text-gray-700 leading-tight">{detection.tiempoVuelta}</p>
            <p className="text-[8px] text-gray-400 uppercase tracking-wider">Vuelta</p>
          </div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="text-center">
            <p className="text-[10px] font-mono font-bold text-gray-700 leading-tight">{detection.velocidad}</p>
            <p className="text-[8px] text-gray-400 uppercase tracking-wider">Km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
