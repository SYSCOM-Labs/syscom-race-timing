import { useState, useCallback } from 'react';

const STORAGE_KEY = 'syscom_pilotos';

function loadPilots() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePilots(pilots) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pilots));
}

export default function usePilots() {
  const [pilots, setPilots] = useState(loadPilots);

  const create = useCallback(({ matricula, piloto, empresa, color, icono }) => {
    const newPilot = {
      id: 'p_' + Date.now().toString(36),
      matricula: matricula.trim(),
      piloto: piloto.trim(),
      empresa: empresa.trim(),
      color: color || '#ea2d45',
      icono: icono || '🏎️',
    };
    const updated = [newPilot, ...pilots];
    setPilots(updated);
    savePilots(updated);
    return newPilot;
  }, [pilots]);

  const update = useCallback((id, data) => {
    const updated = pilots.map(p =>
      p.id === id
        ? {
            ...p,
            matricula: data.matricula.trim(),
            piloto: data.piloto.trim(),
            empresa: data.empresa.trim(),
            color: data.color || p.color,
            icono: data.icono || p.icono,
          }
        : p
    );
    setPilots(updated);
    savePilots(updated);
  }, [pilots]);

  const remove = useCallback((id) => {
    const updated = pilots.filter(p => p.id !== id);
    setPilots(updated);
    savePilots(updated);
  }, [pilots]);

  return { pilots, create, update, remove };
}
