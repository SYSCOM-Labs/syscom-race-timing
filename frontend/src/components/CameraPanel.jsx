export default function CameraPanel({ accent }) {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden bg-[#0f1115] relative flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-2.5 px-4 text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: accent + '22', color: accent }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">Esperando señal</p>
          <p className="text-[11px] text-white/40 mt-1 leading-relaxed max-w-[160px]">
            El video se mostrará al conectar el stream
          </p>
        </div>
      </div>

      <div className="absolute top-3 left-3 w-3.5 h-3.5 border-l-2 border-t-2 border-white/25 rounded-tl" />
      <div className="absolute top-3 right-3 w-3.5 h-3.5 border-r-2 border-t-2 border-white/25 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-l-2 border-b-2 border-white/25 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-r-2 border-b-2 border-white/25 rounded-br" />
    </div>
  );
}
