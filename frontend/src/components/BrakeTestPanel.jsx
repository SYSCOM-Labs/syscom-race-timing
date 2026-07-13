import { useState, useEffect, useRef, useCallback } from 'react';
import { THEMES } from '../theme.js';

const STORAGE_KEY = 'syscom_records_frenado';

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

const BrakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
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
      className="relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 active:scale-95 text-left w-full"
      style={{
        borderColor: isSelected ? accent : '#e5e7eb',
        backgroundColor: isSelected ? accent + '10' : 'white',
        boxShadow: isSelected ? `0 4px 14px ${accent}30` : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: accent }}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div
        className="w-full text-center font-black text-base tracking-widest py-2 px-2 rounded-lg text-white shadow-inner leading-tight"
        style={{ backgroundColor: isSelected ? accent : '#374151' }}
      >
        {auto.matricula}
      </div>
      <p className="text-[11px] font-semibold text-gray-500 text-center leading-tight w-full truncate px-1">
        {auto.equipo}
      </p>
    </button>
  );
}

export default function BrakeTestPanel({ autos, themeMode }) {
  const accent = THEMES[themeMode].accent;

  const [selectedId, setSelectedId] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | running | complete
  const [elapsedMs, setElapsedMs] = useState(0);
  const [records, setRecords] = useState(loadRecords);

  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const selectedAuto = autos.find(a => a.id === selectedId);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const startTimer = useCallback(() => {
    if (!selectedId) return;
    setElapsedMs(0);
    setPhase('running');
    startTimeRef.current = performance.now();
    const rafLoop = () => {
      setElapsedMs(performance.now() - startTimeRef.current);
      rafRef.current = requestAnimationFrame(rafLoop);
    };
    rafRef.current = requestAnimationFrame(rafLoop);
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
    setPhase('idle');
    setElapsedMs(0);
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

  // Color palette for brake test (uses red/orange as accent for urgency)
  const brakeAccent = '#ef4444';

  return (
    <div className="flex flex-col gap-5">
      {/* Panel de cronometraje */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-500">
              <BrakeIcon />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Prueba de Frenado</h3>
              <p className="text-[11px] text-gray-400">Cronometraje Manual</p>
            </div>
          </div>
          {bestTime && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Mejor tiempo</p>
              <p className="font-black font-mono text-lg text-red-500">{formatTime(bestTime)}</p>
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
                style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}
              >
                <div className="font-black text-white text-sm px-3 py-1.5 rounded-lg tracking-wider bg-red-500">
                  {selectedAuto.matricula}
                </div>
                <span className="text-sm font-semibold text-gray-600">{selectedAuto.equipo}</span>
                <div className="ml-auto flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-red-500">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  En prueba
                </div>
              </div>
            ) : (
              /* Grid de tarjetas */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto pr-1">
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
                    accent="#ef4444"
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
              backgroundColor: phase === 'running' ? '#fef2f2' : phase === 'complete' ? '#fef2f2' : '#f9fafb',
              border: `2px solid ${phase === 'running' ? '#fca5a5' : phase === 'complete' ? '#fca5a580' : '#e5e7eb'}`,
            }}
          >
            {/* Decorative bg circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-5 bg-red-500" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-5 bg-red-500" />

            <div className="text-center relative z-10">
              {phase === 'idle' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-300">
                    <BrakeIcon />
                  </div>
                  <p className="text-gray-400 text-sm font-medium max-w-[240px] leading-relaxed">
                    Selecciona un participante y presiona <strong>Iniciar</strong> cuando el vehículo cruce la línea de frenado
                  </p>
                </div>
              )}

              {phase === 'running' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Frenando...</p>
                  </div>
                  <p className="text-6xl font-black font-mono tracking-tight text-red-600">
                    {formatTime(elapsedMs)}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    Presiona <strong>DETENER</strong> cuando el vehículo esté completamente detenido
                  </p>
                </div>
              )}

              {phase === 'complete' && (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Tiempo de Frenado</p>
                  </div>
                  <p className="text-6xl font-black font-mono tracking-tight text-red-500">
                    {formatTime(elapsedMs)}
                  </p>
                  {selectedAuto && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-white text-xs px-3 py-1 rounded-lg shadow-sm bg-red-500">
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
                onClick={startTimer}
                disabled={!selectedId}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg cursor-pointer hover:scale-[1.03] hover:shadow-xl active:scale-95 bg-red-500"
                style={{ boxShadow: '0 4px 15px rgba(239,68,68,0.4)' }}
              >
                <BrakeIcon />
                Iniciar Frenado
              </button>
            )}

            {phase === 'running' && (
              <button
                onClick={stopTimer}
                className="flex items-center gap-2.5 px-10 py-4 rounded-xl text-white font-black text-base tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-150 bg-gray-800"
                style={{ boxShadow: '0 6px 25px rgba(30,30,30,0.5)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                DETENER
              </button>
            )}

            {phase === 'complete' && (
              <>
                <button
                  onClick={saveRecord}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.03] hover:shadow-lg active:scale-95 bg-red-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Guardar Tiempo
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 border-2 border-red-300 text-red-500 cursor-pointer hover:bg-red-50 active:scale-95"
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
              Historial — Frenado
            </p>
            {records.length > 0 && (
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-red-400">
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
            <p className="text-xs mt-1">Los tiempos de frenado aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matrícula</th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Equipo</th>
                  <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">T. Frenado</th>
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
                      className="group transition-all duration-200 hover:bg-red-50/30"
                      style={{ backgroundColor: isBest ? '#fef2f220' : undefined }}
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-black text-xs" style={{ color: isBest ? '#ef4444' : '#9ca3af' }}>
                          {isBest ? '🏆' : `#${i + 1}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-xs font-black text-white px-2.5 py-1 rounded-lg shadow-sm" style={{ backgroundColor: isBest ? '#ef4444' : '#9ca3af' }}>
                          {r.matricula}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600 text-xs font-medium">{r.equipo}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="font-mono font-black text-base" style={{ color: isBest ? '#ef4444' : '#374151' }}>
                          {formatTime(r.tiempoMs)}
                        </span>
                        {isBest && (
                          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-red-500">Mejor</span>
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
