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

export default function BrakeTestPanel({ autos, themeMode }) {
  const accent = THEMES[themeMode].accent;

  const [selectedId, setSelectedId] = useState('');
  const [phase, setPhase] = useState('idle');
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

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-4">
          Prueba de Frenado — Cronometraje Manual
        </p>

        <div className="mb-6">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5">
            Seleccionar Participante
          </label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            disabled={phase !== 'idle'}
            className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 disabled:opacity-40 cursor-pointer transition-all"
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
            <p className="text-gray-400 text-sm">Selecciona un participante y presiona "Iniciar" cuando llegue a la línea de velocidad</p>
          )}
          {phase === 'running' && (
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Cronometrando Frenado</p>
              <p className="text-5xl font-black font-mono" style={{ color: accent }}>
                {formatTime(elapsedMs)}
              </p>
              <p className="text-xs text-gray-400 mt-2">Presiona "Detener" cuando el vehículo se haya detenido por completo</p>
            </div>
          )}
          {phase === 'complete' && (
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Tiempo de Frenado</p>
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
              onClick={startTimer}
              disabled={!selectedId}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wider transition-all duration-200 disabled:opacity-30 shadow-sm cursor-pointer hover:scale-[1.02] hover:opacity-90 active:scale-98"
              style={{ backgroundColor: accent }}
            >
              Iniciar
            </button>
          )}
          {phase === 'running' && (
            <button
              onClick={stopTimer}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wider shadow-lg animate-pulse cursor-pointer hover:opacity-90 active:scale-98"
              style={{ backgroundColor: '#dc2626' }}
            >
              DETENER
            </button>
          )}
          {phase === 'complete' && (
            <>
              <button
                onClick={saveRecord}
                className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wider transition-all duration-200 shadow-sm cursor-pointer hover:scale-[1.02] hover:opacity-90 active:scale-98"
                style={{ backgroundColor: accent }}
              >
                Guardar Tiempo
              </button>
              <button
                onClick={resetAll}
                className="px-8 py-3 rounded-xl font-bold text-sm tracking-wider transition-all duration-200 border cursor-pointer hover:bg-gray-50 active:scale-98"
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
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Historial de Pruebas (Frenado)</p>
          {records.length > 0 && (
            <button onClick={clearAllRecords} className="text-[10px] text-red-400 hover:text-red-600 uppercase tracking-wider font-medium cursor-pointer transition-colors">
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
                  <th className="text-right py-2.5 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">T. Frenado</th>
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
