import { useState, useEffect, useCallback, useRef } from 'react';

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
  return parseInt(m, 10) * 60000 + parseInt(s, 10) * 1000 + parseInt(ms, 10) * 10;
}

// ⏱️ CAMBIO ESTRATÉGICO PARA PRUEBAS: Configurado a 30 segundos en lugar de 4 horas
export const RACE_TOTAL_MS = 30 * 1000; 

export default function useSimulatedRace() {
  const [autos, setAutos] = useState(INITIAL_AUTOS);
  const [remainingMs, setRemainingMs] = useState(RACE_TOTAL_MS);
  const [isRunning, setIsRunning] = useState(false);
  const [cameraDetections, setCameraDetections] = useState([]);
  const autosRef = useRef(autos);
  // Reloj por timestamp: evita la latencia de esperar el primer tick de setInterval
  const endAtRef = useRef(null);
  const remainingAtPauseRef = useRef(RACE_TOTAL_MS);

  useEffect(() => { autosRef.current = autos; }, [autos]);

  const toggleRace = useCallback(() => {
    if (isRunning) {
      const remaining = endAtRef.current != null
        ? Math.max(0, endAtRef.current - Date.now())
        : remainingAtPauseRef.current;
      remainingAtPauseRef.current = remaining;
      endAtRef.current = null;
      setRemainingMs(remaining);
      setIsRunning(false);
      return;
    }

    const base = remainingAtPauseRef.current === 0 ? RACE_TOTAL_MS : remainingAtPauseRef.current;
    remainingAtPauseRef.current = base;
    endAtRef.current = Date.now() + base;
    setRemainingMs(base);
    setIsRunning(true);
  }, [isRunning]);

  // Countdown anclado a Date.now() — respuesta inmediata al iniciar/pausar
  useEffect(() => {
    if (!isRunning) return undefined;

    const tick = () => {
      const remaining = Math.max(0, (endAtRef.current ?? Date.now()) - Date.now());
      setRemainingMs(remaining);
      if (remaining === 0) {
        remainingAtPauseRef.current = 0;
        endAtRef.current = null;
        setIsRunning(false);
      }
    };

    tick();
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [isRunning]);

  // Loop de Simulación por Evento RFID / Radar Doppler
  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = setInterval(() => {
      const randomId = String(Math.floor(Math.random() * 6) + 1).padStart(2, '0');
      const incrementLap = Math.random() < 0.3;

      const currentAutos = autosRef.current;
      const targetAuto = currentAutos.find(a => a.id === randomId);
      if (!targetAuto) return;

      // Generamos los nuevos deltas técnicos del evento
      const newLapTime = generateRandomTime();
      const newLapMs = parseTimeToMs(newLapTime);
      
      const speedDelta = (Math.random() - 0.5) * 4;
      const nextSpeed = Math.round(Math.max(30, Math.min(60, targetAuto.velocidadMaxima + speedDelta)) * 10) / 10;

      const brakeDelta = (Math.random() - 0.5) * 0.6;
      const nextBrake = Math.round(Math.max(2.5, Math.min(5.5, targetAuto.frenadoMetros + brakeDelta)) * 100) / 100;

      const statuses = ['active', 'active', 'active', 'pit', 'active', 'pit-stop'];
      const nextStatus = Math.random() < 0.1 
        ? statuses[Math.floor(Math.random() * statuses.length)] 
        : targetAuto.status;

      const nextLaps = incrementLap ? targetAuto.vueltas + 1 : targetAuto.vueltas;
      const nextBestVuelta = (incrementLap && newLapMs < parseTimeToMs(targetAuto.mejorVuelta))
        ? newLapTime
        : targetAuto.mejorVuelta;

      // 💥 ARQUITECTURA ATÓMICA: Actualizamos la base de autos
      setAutos(prev => prev.map(auto => {
        if (auto.id !== randomId) return auto;
        return {
          ...auto,
          vueltas: nextLaps,
          ultimaVuelta: newLapTime,
          mejorVuelta: nextBestVuelta,
          velocidadMaxima: nextSpeed,
          frenadoMetros: nextBrake,
          status: nextStatus
        };
      }));

      // 🔥 HIDRATACIÓN DE TELEMETRÍA: Datos frescos y sincronizados al instante
      setCameraDetections(prev => {
        const detection = {
          id: `${Date.now()}-${randomId}`,
          matricula: targetAuto.matricula,
          vuelta: nextLaps,
          tiempoVuelta: newLapTime,
          velocidad: nextSpeed,
        };
        return [detection, ...prev].slice(0, 3);
      });

    }, 3000); // Frecuencia de ráfagas: 3 segundos

    return () => clearInterval(interval);
  }, [isRunning]);

  // Función de ordenación optimizada: Mantiene la lógica del desempate del circuito
  const sortedAutos = [...autos].sort((a, b) => {
    if (b.vueltas !== a.vueltas) {
      return b.vueltas - a.vueltas; // Gana el que tenga más vueltas acumuladas
    }
    // Si tienen las mismas vueltas, se desempata por la vuelta más rápida registrada en ms
    return parseTimeToMs(a.mejorVuelta) - parseTimeToMs(b.mejorVuelta);
  });

  const hours = Math.floor(remainingMs / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const cronometro = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const leader = sortedAutos[0] || null;
  const totalActive = autos.filter(a => a.status === 'active').length;

  return {
    autos: sortedAutos,
    cronometro,
    leader,
    totalActive,
    remainingMs,
    totalMs: RACE_TOTAL_MS,
    isRunning,
    toggleRace,
    cameraDetections,
  };
}