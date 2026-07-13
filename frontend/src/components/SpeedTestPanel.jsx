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

export default function SpeedTestPanel({ autos, themeMode }) {
  const accent = THEMES[themeMode].accent;

  const [selectedId, setSelectedId] = useState('');
  const [phase, setPhase] = useState('idle');
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

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-4">
          Prueba de Velocidad — Cronometraje Manual
        </p>

        <div className="mb-6">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5">
            Seleccionar Participante
          </label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            disabled={phase !== 'idle'}
            className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 disabled:opacity-40 transition-all"
            style={{ focusRing: `2px solid ${accent}` }}
          >
            <option value="">— Seleccionar —</option>
            {autos.map(auto => (
              <option key={auto.id} value={auto.id}>
                {auto.matricula} — {auto.equipo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center mb-6 min-h-[120px]">
          {phase === 'idle' && (
            <p className="text-gray-400 text-sm">Presiona "Preparar" para iniciar la cuenta regresiva</p>
          )}
          {phase === 'countdown' && countdownValue > 0 && (
            <p className="text-7xl font-black animate-pulse" style={{ color: accent }}>
              {countdownValue}
            </p>
          )}
          {phase === 'countdown' && countdownValue === 0 && (
            <div className="text-center">
              <p className="text-6xl font-black" style={{ color: accent }}>¡YA!</p>
              <p className="text-xs text-gray-400 mt-2">El participante debe iniciar</p>
            </div>
          )}
          {phase === 'running' && (
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Cronometrando</p>
              <p className="text-5xl font-black font-mono" style={{ color: accent }}>
                {formatTime(elapsedMs)}
              </p>
            </div>
          )}
          {phase === 'complete' && (
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Tiempo Final</p>
              <p className="text-5xl font-black font-mono" style={{ color: accent }}>
                {formatTime(elapsedMs)}
              </p>
              {selectedAuto && (
                <p className="text-sm text-gray-500 mt-1">
                  {selectedAuto.matricula} — {selectedAuto.equipo}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          {phase === 'idle' && (
            <button
              onClick={startCountdown}
              disabled={!selectedId}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wider transition-all duration-200 disabled:opacity-30 shadow-sm"
              style={{ backgroundColor: accent }}
            >
              Preparar
            </button>
          )}
          {phase === 'running' && (
            <button
              onClick={stopTimer}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wider shadow-lg animate-pulse"
              style={{ backgroundColor: '#dc2626' }}
            >
              DETENER
            </button>
          )}
          {phase === 'complete' && (
            <>
              <button
                onClick={saveRecord}
                className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wider transition-all duration-200 shadow-sm"
                style={{ backgroundColor: accent }}
              >
                Guardar Tiempo
              </button>
              <button
                onClick={resetAll}
                className="px-8 py-3 rounded-xl font-bold text-sm tracking-wider transition-all duration-200 border"
                style={{ color: accent, borderColor: accent }}
              >
                Nueva Prueba
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-card-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Historial de Pruebas (Velocidad)</p>
          {records.length > 0 && (
            <button onClick={clearAllRecords} className="text-[10px] text-red-400 hover:text-red-600 uppercase tracking-wider font-medium">
              Limpiar Todo
            </button>
          )}
        </div>
        {records.length === 0 ? (
          <p className="text-gray-400 text-sm px-6 pb-5">No hay registros guardados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">#</th>
                  <th className="text-left py-2.5 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Matrícula</th>
                  <th className="text-left py-2.5 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Equipo</th>
                  <th className="text-right py-2.5 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Tiempo</th>
                  <th className="text-right py-2.5 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Registrado</th>
                  <th className="py-2.5 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id} className="border-b border-gray-50 transition-all duration-200 hover:bg-gray-50">
                    <td className="py-2.5 px-4 text-gray-400 font-bold text-xs">{i + 1}</td>
                    <td className="py-2.5 px-4">
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: accent }}>
                        {r.matricula}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-gray-600 text-xs">{r.equipo}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold" style={{ color: accent }}>
                      {formatTime(r.tiempoMs)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-[10px] text-gray-400">{r.timestamp}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button onClick={() => deleteRecord(r.id)} className="text-gray-300 hover:text-red-400 transition-colors text-sm">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
