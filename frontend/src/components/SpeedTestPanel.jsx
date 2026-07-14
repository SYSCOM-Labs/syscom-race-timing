import { useState, useEffect, useRef, useCallback } from 'react';
import { THEMES } from '../theme.js';

const STORAGE_KEY = 'syscom_records_velocidad';

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const cent = Math.floor((ms % 1000) / 10);
  return `${s}.${String(cent).padStart(2, '0')}s`;
}

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

function ParticipantCard({ auto, isSelected, isDisabled, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 text-left w-full',
        'transition-[border-color,background-color,box-shadow] duration-150',
        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        isSelected
          ? 'border-transparent'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
      ].join(' ')}
      style={{
        borderColor: isSelected ? accent : undefined,
        backgroundColor: isSelected ? accent + '10' : undefined,
        boxShadow: isSelected ? `0 2px 8px ${accent}25` : undefined,
      }}
    >
      {isSelected && (
        <div
          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accent }}
        >
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div
        className="w-full text-center font-black text-sm tracking-wider py-1.5 px-1.5 rounded-md text-white leading-tight truncate"
        style={{ backgroundColor: isSelected ? accent : '#1f2937' }}
      >
        {auto.matricula}
      </div>
      <p className="text-[10px] font-medium text-gray-500 text-center leading-tight w-full truncate">
        {auto.equipo}
      </p>
    </button>
  );
}

export default function SpeedTestPanel({ autos, themeMode }) {
  const accent = THEMES[themeMode].accent;

  const [selectedId, setSelectedId] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | countdown | running | complete
  const [countdownValue, setCountdownValue] = useState(3);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [records, setRecords] = useState(loadRecords);

  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const countdownRef = useRef(null);
  const yaTimerRef = useRef(null);

  const selectedAuto = autos.find(a => a.id === selectedId);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (yaTimerRef.current) clearTimeout(yaTimerRef.current);
    };
  }, []);

  const startCountdown = useCallback(() => {
    if (!selectedId) return;
    setPhase('countdown');
    setCountdownValue(3);
    setElapsedMs(0);
    let count = 3;
    countdownRef.current = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(countdownRef.current);
        setCountdownValue(0);
        yaTimerRef.current = setTimeout(() => {
          setPhase('running');
          startTimeRef.current = performance.now();
          const rafLoop = () => {
            setElapsedMs(performance.now() - startTimeRef.current);
            rafRef.current = requestAnimationFrame(rafLoop);
          };
          rafRef.current = requestAnimationFrame(rafLoop);
        }, 600);
      } else {
        setCountdownValue(count);
      }
    }, 1000);
  }, [selectedId]);

  const stopTimer = useCallback(() => {
    if (phase !== 'running') return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const finalMs = performance.now() - startTimeRef.current;
    setElapsedMs(finalMs);
    setPhase('complete');
  }, [phase]);

  const saveRecord = useCallback(() => {
    if (!selectedAuto || phase !== 'complete') return;
    const newRecord = {
      id: Date.now().toString(),
      autoId: selectedAuto.id,
      matricula: selectedAuto.matricula,
      equipo: selectedAuto.equipo,
      tiempoMs: Math.round(elapsedMs),
      timestamp: new Date().toLocaleString('es-MX'),
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    saveRecords(updated);
  }, [selectedAuto, phase, elapsedMs, records]);

  const resetAll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (yaTimerRef.current) clearTimeout(yaTimerRef.current);
    setPhase('idle');
    setElapsedMs(0);
    setCountdownValue(3);
  }, []);

  const deleteRecord = useCallback((recordId) => {
    const updated = records.filter(r => r.id !== recordId);
    setRecords(updated);
    saveRecords(updated);
  }, [records]);

  const clearAllRecords = useCallback(() => {
    setRecords([]);
    saveRecords([]);
  }, []);

  const bestTime = records.length > 0 ? Math.min(...records.map(r => r.tiempoMs)) : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Panel de cronometraje */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: accent + '06' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: accent + '15', color: accent }}>
              <ZapIcon />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Prueba de Velocidad</h3>
              <p className="text-[11px] text-gray-400">Cronometraje Manual</p>
            </div>
          </div>
          {bestTime && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Mejor tiempo</p>
              <p className="font-black font-mono text-lg" style={{ color: accent }}>{formatTime(bestTime)}</p>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Selector de participante: tarjetas */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Seleccionar Participante
              </label>
              {selectedId && phase === 'idle' && (
                <button
                  onClick={() => setSelectedId('')}
                  className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  Limpiar selección
                </button>
              )}
            </div>

            {phase !== 'idle' && selectedAuto ? (
              /* Resumen compacto durante la prueba */
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2"
                style={{ borderColor: accent + '40', backgroundColor: accent + '08' }}
              >
                <div
                  className="font-black text-white text-sm px-3 py-1.5 rounded-lg tracking-wider"
                  style={{ backgroundColor: accent }}
                >
                  {selectedAuto.matricula}
                </div>
                <span className="text-sm font-semibold text-gray-600">{selectedAuto.equipo}</span>
                <div className="ml-auto flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                  En prueba
                </div>
              </div>
            ) : (
              /* Grid de tarjetas */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-52 overflow-y-auto overscroll-contain pr-1">
                {autos.length === 0 ? (
                  <div className="col-span-full py-6 text-center text-gray-400 text-sm">
                    No hay participantes registrados
                  </div>
                ) : autos.map(auto => (
                  <ParticipantCard
                    key={auto.id}
                    auto={auto}
                    isSelected={selectedId === auto.id}
                    isDisabled={phase !== 'idle'}
                    accent={accent}
                    onClick={() => setSelectedId(prev => prev === auto.id ? '' : auto.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pantalla del cronómetro */}
          <div
            className="rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 relative overflow-hidden"
            style={{
              minHeight: '180px',
              backgroundColor: phase === 'running' ? '#fef2f2' : phase === 'complete' ? accent + '08' : '#f9fafb',
              border: `2px solid ${phase === 'running' ? '#fca5a5' : phase === 'complete' ? accent + '30' : '#e5e7eb'}`,
            }}
          >
            {/* Decorative bg circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-12 blur-xl" style={{ backgroundColor: accent }} />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-12 blur-xl" style={{ backgroundColor: accent }} />

            <div className="text-center relative z-10">
              {phase === 'idle' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center" style={{ color: accent + '60' }}>
                    <ZapIcon />
                  </div>
                  <p className="text-gray-400 text-sm font-medium max-w-[220px] leading-relaxed">
                    Selecciona un participante y presiona <strong>Preparar</strong> para iniciar
                  </p>
                </div>
              )}

              {phase === 'countdown' && countdownValue > 0 && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Preparando...</p>
                  <p
                    className="text-8xl font-black leading-none animate-bounce"
                    style={{ color: accent }}
                  >
                    {countdownValue}
                  </p>
                </div>
              )}

              {phase === 'countdown' && countdownValue === 0 && (
                <div className="flex flex-col items-center gap-2">
                  <p
                    className="text-7xl font-black animate-pulse tracking-wide"
                    style={{ color: accent }}
                  >
                    ¡YA!
                  </p>
                  <p className="text-xs text-gray-400 font-medium">El participante debe iniciar ahora</p>
                </div>
              )}

              {phase === 'running' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Cronometrando</p>
                  </div>
                  <p className="text-6xl font-black font-mono tracking-tight" style={{ color: '#dc2626' }}>
                    {formatTime(elapsedMs)}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Presiona DETENER cuando el vehículo cruce la línea de meta</p>
                </div>
              )}

              {phase === 'complete' && (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Tiempo Final</p>
                  </div>
                  <p className="text-6xl font-black font-mono tracking-tight" style={{ color: accent }}>
                    {formatTime(elapsedMs)}
                  </p>
                  {selectedAuto && (
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="font-black text-white text-xs px-3 py-1 rounded-lg shadow-sm"
                        style={{ backgroundColor: accent }}
                      >
                        {selectedAuto.matricula}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{selectedAuto.equipo}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-center">
            {phase === 'idle' && (
              <button
                onClick={startCountdown}
                disabled={!selectedId}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg cursor-pointer hover:scale-[1.03] hover:shadow-xl active:scale-95"
                style={{ backgroundColor: accent, boxShadow: `0 4px 15px ${accent}50` }}
              >
                <ZapIcon />
                Preparar
              </button>
            )}

            {phase === 'countdown' && (
              <button
                onClick={resetAll}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-gray-500 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
            )}

            {phase === 'running' && (
              <button
                onClick={stopTimer}
                className="flex items-center gap-2.5 px-10 py-4 rounded-xl text-white font-black text-base tracking-widest shadow-2xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-150"
                style={{
                  backgroundColor: '#dc2626',
                  boxShadow: '0 6px 25px rgba(220,38,38,0.5)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                DETENER
              </button>
            )}

            {phase === 'complete' && (
              <>
                <button
                  onClick={saveRecord}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.03] hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: accent }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Guardar Tiempo
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 border-2 cursor-pointer hover:bg-gray-50 active:scale-95"
                  style={{ color: accent, borderColor: accent }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Nueva Prueba
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Historial de registros */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Historial — Velocidad
            </p>
            {records.length > 0 && (
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: accent }}>
                {records.length}
              </span>
            )}
          </div>
          {records.length > 0 && (
            <button
              onClick={clearAllRecords}
              className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-600 font-bold uppercase tracking-wider cursor-pointer transition-colors hover:bg-red-50 px-3 py-1.5 rounded-lg"
            >
              <TrashIcon />
              Limpiar Todo
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg className="w-10 h-10 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p className="text-sm font-medium">No hay registros guardados</p>
            <p className="text-xs mt-1">Los tiempos aparecerán aquí después de guardar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matrícula</th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Equipo</th>
                  <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiempo</th>
                  <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Registrado</th>
                  <th className="py-3 px-5 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((r, i) => {
                  const isBest = r.tiempoMs === bestTime;
                  return (
                    <tr
                      key={r.id}
                      className="group transition-all duration-200 hover:bg-gray-50"
                      style={{ backgroundColor: isBest ? accent + '06' : undefined }}
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-black text-xs" style={{ color: isBest ? accent : '#9ca3af' }}>
                          {isBest ? '🏆' : `#${i + 1}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className="text-xs font-black text-white px-2.5 py-1 rounded-lg shadow-sm"
                          style={{ backgroundColor: isBest ? accent : '#9ca3af' }}
                        >
                          {r.matricula}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600 text-xs font-medium">{r.equipo}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span
                          className="font-mono font-black text-base"
                          style={{ color: isBest ? accent : '#374151' }}
                        >
                          {formatTime(r.tiempoMs)}
                        </span>
                        {isBest && (
                          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>Mejor</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right text-[10px] text-gray-400 hidden md:table-cell">{r.timestamp}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => deleteRecord(r.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all duration-200 cursor-pointer p-1 rounded hover:bg-red-50"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
