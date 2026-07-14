import { useState, useCallback } from 'react';

const STORAGE_KEY = 'syscom_camera_config';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { usuario: '', password: '', ip: '' };
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export default function useCameraConfig() {
  const [config, setConfig] = useState(loadConfig);

  const updateConfig = useCallback((field, value) => {
    setConfig(prev => {
      const next = { ...prev, [field]: value };
      saveConfig(next);
      return next;
    });
  }, []);

  const isConfigured = config.usuario && config.password && config.ip;

  return { config, updateConfig, isConfigured };
}
