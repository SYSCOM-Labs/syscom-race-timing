import { useState, useCallback } from 'react';

const STORAGE_KEY = 'syscom_seguridad';

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const EMPTY_CHECKLIST = {
  casco: false,
  cinturon: false,
  puntosEmpuje: false,
  paroEmergencia: false,
};

export default function useSeguridad() {
  const [checks, setChecks] = useState(loadAll);

  const getStatus = useCallback((pilotId) => {
    return checks[pilotId] || { ...EMPTY_CHECKLIST };
  }, [checks]);

  const update = useCallback((pilotId, data) => {
    const updated = { ...checks, [pilotId]: { ...EMPTY_CHECKLIST, ...data } };
    setChecks(updated);
    saveAll(updated);
  }, [checks]);

  const toggle = useCallback((pilotId, field) => {
    const current = checks[pilotId] || { ...EMPTY_CHECKLIST };
    const updated = { ...checks, [pilotId]: { ...current, [field]: !current[field] } };
    setChecks(updated);
    saveAll(updated);
  }, [checks]);

  const isComplete = useCallback((pilotId) => {
    const s = checks[pilotId];
    if (!s) return false;
    return s.casco && s.cinturon && s.puntosEmpuje && s.paroEmergencia;
  }, [checks]);

  return { checks, getStatus, update, toggle, isComplete };
}
