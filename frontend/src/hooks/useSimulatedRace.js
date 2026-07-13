import { useState, useEffect, useCallback } from 'react';

const INITIAL_AUTOS = [
  { id: '01', matricula: 'CUERVO-4.0', equipo: 'Universidad Tecnológica', vueltas: 12, ultimaVuelta: '01:24.52', mejorVuelta: '01:22.10', velocidadMaxima: 45.2, frenadoMetros: 3.50, status: 'active' },
  { id: '02', matricula: 'SOLARIS-7', equipo: 'Instituto Tecnológico', vueltas: 11, ultimaVuelta: '01:25.13', mejorVuelta: '01:23.45', velocidadMaxima: 42.8, frenadoMetros: 3.80, status: 'active' },
  { id: '03', matricula: 'AZTECA-1', equipo: 'UNAM Solar', vueltas: 10, ultimaVuelta: '01:26.78', mejorVuelta: '01:24.30', velocidadMaxima: 44.1, frenadoMetros: 3.20, status: 'pit' },
  { id: '04', matricula: 'RAYO-9', equipo: 'Universidad Autónoma', vueltas: 9, ultimaVuelta: '01:27.04', mejorVuelta: '01:25.91', velocidadMaxima: 43.5, frenadoMetros: 4.10, status: 'active' },
  { id: '05', matricula: 'SOL-3', equipo: 'Politécnico Nacional', vueltas: 8, ultimaVuelta: '01:28.35', mejorVuelta: '01:26.15', velocidadMaxima: 41.9, frenadoMetros: 3.60, status: 'active' },
  { id: '06', matricula: 'FOTON-2', equipo: 'Universidad de Sonora', vueltas: 7, ultimaVuelta: '01:29.12', mejorVuelta: '01:27.88', velocidadMaxima: 40.3, frenadoMetros: 4.30, status: 'pit-stop' },
];

function generateRandomTime(baseMinutes = 1, baseSeconds = 20) {
  const m = baseMinutes + Math.floor(Math.random() * 3);
  const s = baseSeconds + Math.floor(Math.random() * 15);
  const ms = Math.floor(Math.random() * 99);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function parseTimeToMs(timeStr) {
  const [minSec, ms] = timeStr.split('.');
  const [m, s] = minSec.split(':');
  return parseInt(m) * 60000 + parseInt(s) * 1000 + parseInt(ms) * 10;
}

export default function useSimulatedRace() {
  const [autos, setAutos] = useState(INITIAL_AUTOS);
  const [remainingMs, setRemainingMs] = useState(4 * 60 * 60 * 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs(prev => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    /*
     * SIMULACIÓN DE EVENTOS EN TIEMPO REAL
     * ======================================
     * En producción, aquí se conectaría el WebSocket real:
     *
     *   const ws = new WebSocket('ws://localhost:8000/ws');
     *   ws.onmessage = (event) => {
     *     const data = JSON.parse(event.data);
     *     if (data.type === 'UPDATE_LEADERBOARD') {
     *       setAutos(data.payload);
     *     } else if (data.type === 'NEW_LAP') {
     *       setAutos(prev => prev.map(auto =>
     *         auto.id === data.autoId
     *           ? { ...auto, vueltas: auto.vueltas + 1, ultimaVuelta: data.tiempo }
     *           : auto
     *       ));
     *     }
     *   };
     *   return () => ws.close();
     */

    const interval = setInterval(() => {
      const randomId = String(Math.floor(Math.random() * 6) + 1).padStart(2, '0');
      const incrementLap = Math.random() < 0.3;

      setAutos(prev => prev.map(auto => {
        if (auto.id !== randomId) return auto;

        const newLapTime = generateRandomTime();
        const newLapMs = parseTimeToMs(newLapTime);
        let updated = { ...auto, ultimaVuelta: newLapTime };

        if (incrementLap) {
          updated.vueltas = auto.vueltas + 1;
          if (newLapMs < parseTimeToMs(auto.mejorVuelta)) {
            updated.mejorVuelta = newLapTime;
          }
        }

        const speedDelta = (Math.random() - 0.5) * 4;
        updated.velocidadMaxima = Math.round(Math.max(30, Math.min(60, auto.velocidadMaxima + speedDelta)) * 10) / 10;

        const brakeDelta = (Math.random() - 0.5) * 0.6;
        updated.frenadoMetros = Math.round(Math.max(2.5, Math.min(5.5, auto.frenadoMetros + brakeDelta)) * 100) / 100;

        const statuses = ['active', 'active', 'active', 'pit', 'active', 'pit-stop'];
        if (Math.random() < 0.1) {
          updated.status = statuses[Math.floor(Math.random() * statuses.length)];
        }

        return updated;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sortedByLaps = useCallback(() => {
    return [...autos].sort((a, b) => b.vueltas - a.vueltas || parseTimeToMs(a.mejorVuelta) - parseTimeToMs(b.mejorVuelta));
  }, [autos]);

  const hours = Math.floor(remainingMs / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const cronometro = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const sortedAutos = sortedByLaps();
  const leader = sortedAutos[0] || null;
  const totalActive = autos.filter(a => a.status === 'active').length;

  return {
    autos: sortedAutos,
    cronometro,
    leader,
    totalActive,
  };
}
