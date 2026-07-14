import { useState, useCallback } from 'react';
import { THEMES } from '../theme.js';

const STORAGE_KEY = 'syscom_records_frenado';

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
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

function ParticipantCard({ auto, isSelected, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 text-left w-full',
        'transition-[border-color,background-color,box-shadow] duration-150',
        'cursor-pointer',
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

export default function BrakeTestPanel({ autos, themeMode }) {
  const accent = '#ef4444';

  const [selectedId, setSelectedId] = useState('');
  const [distancia, setDistancia] = useState('');
  const [records, setRecords] = useState(loadRecords);

  const selectedAuto = autos.find(a => a.id === selectedId);

  const saveRecord = useCallback(() => {
    if (!selectedAuto || !distancia) return;
    const d = parseFloat(distancia);
    if (isNaN(d) || d <= 0) return;
    const newRecord = {
      id: Date.now().toString(),
      autoId: selectedAuto.id,
      matricula: selectedAuto.matricula,
      equipo: selectedAuto.equipo,
      distanciaMetros: d,
      timestamp: new Date().toLocaleString('es-MX'),
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    saveRecords(updated);
    setDistancia('');
    setSelectedId('');
  }, [selectedAuto, distancia, records]);

  const deleteRecord = useCallback((recordId) => {
    const updated = records.filter(r => r.id !== recordId);
    setRecords(updated);
    saveRecords(updated);
  }, [records]);

  const clearAllRecords = useCallback(() => {
    setRecords([]);
    saveRecords([]);
  }, []);

  const bestDist = records.length > 0 ? Math.min(...records.map(r => r.distanciaMetros)) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-500">
              <BrakeIcon />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Prueba de Frenado</h3>
              <p className="text-[11px] text-gray-400">Registro de distancia</p>
            </div>
          </div>
          {bestDist && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Mejor distancia</p>
              <p className="font-black font-mono text-lg text-red-500">{bestDist.toFixed(2)} <span className="text-sm">m</span></p>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Seleccionar Participante
              </label>
            </div>

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
                  accent={accent}
                  onClick={() => setSelectedId(prev => prev === auto.id ? '' : auto.id)}
                />
              ))}
            </div>
          </div>

          {selectedAuto && (
            <div className="rounded-2xl flex flex-col items-center justify-center mb-6 transition-all duration-500"
                 style={{ minHeight: '200px', backgroundColor: '#fef2f2', border: '2px solid #fca5a5' }}>
              <div className="flex flex-col items-center gap-4 w-full max-w-xs px-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-400 shrink-0">
                  <BrakeIcon />
                </div>
                <div className="text-center">
                  <p className="font-black text-white text-sm px-3 py-1.5 rounded-lg tracking-wider bg-red-500 inline-block mb-2">
                    {selectedAuto.matricula}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">{selectedAuto.equipo}</p>
                </div>
                <div className="w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Distancia de frenado (metros)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={distancia}
                    onChange={e => setDistancia(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border-2 text-center text-2xl font-black font-mono tabular-nums text-gray-800 placeholder:text-gray-300 focus:outline-none transition"
                    style={{ borderColor: '#fca5a5', backgroundColor: 'white' }}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = '#fca5a5'}
                    autoFocus
                  />
                </div>
                <button
                  onClick={saveRecord}
                  disabled={!distancia || parseFloat(distancia) <= 0}
                  className="w-full flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer hover:scale-[1.02] active:scale-95"
                  style={{ backgroundColor: accent, boxShadow: `0 4px 15px ${accent}50` }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Guardar Registro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
            <p className="text-xs mt-1">Las distancias de frenado aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matrícula</th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Equipo</th>
                  <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distancia</th>
                  <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Registrado</th>
                  <th className="py-3 px-5 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((r, i) => {
                  const isBest = r.distanciaMetros === bestDist;
                  return (
                    <tr
                      key={r.id}
                      className="group transition-all duration-200 hover:bg-red-50/30"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-black text-xs" style={{ color: isBest ? accent : '#9ca3af' }}>
                          {isBest ? '🏆' : `#${i + 1}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-xs font-black text-white px-2.5 py-1 rounded-lg shadow-sm" style={{ backgroundColor: isBest ? accent : '#9ca3af' }}>
                          {r.matricula}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600 text-xs font-medium">{r.equipo}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="font-mono font-black text-base" style={{ color: isBest ? accent : '#374151' }}>
                          {r.distanciaMetros.toFixed(2)}
                          <span className="text-sm font-medium text-gray-400 ml-0.5">m</span>
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
