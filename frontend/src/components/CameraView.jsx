import { useState, useEffect, useRef } from 'react';
import { sileo } from 'sileo';
import { THEMES } from '../theme.js';
import useCameraConfig from '../hooks/useCameraConfig.js';
import CameraPanel from './CameraPanel.jsx';

export default function CameraView({ themeMode }) {
  const accent = THEMES[themeMode].accent;
  const { config, updateConfig, isConfigured } = useCameraConfig();
  const [showPassword, setShowPassword] = useState(false);
  const wasConfiguredRef = useRef(isConfigured);

  useEffect(() => {
    if (isConfigured && !wasConfiguredRef.current) {
      wasConfiguredRef.current = true;
      sileo.success({ title: 'Configuración guardada', description: 'Cámara configurada correctamente' });
    } else if (!isConfigured) {
      wasConfiguredRef.current = false;
    }
  }, [isConfigured]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent + '15', color: accent }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Configuración de Cámara</h2>
          <p className="text-xs text-gray-400">Conecta una cámara IP para transmisión en vivo</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Form */}
        <div className="w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Credenciales</p>

          <div className="space-y-3 flex-1">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Usuario</label>
              <input
                type="text"
                value={config.usuario}
                onChange={e => updateConfig('usuario', e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition"
                style={{ focusRing: accent }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={config.password}
                  onChange={e => updateConfig('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition pr-10"
                  onFocus={e => e.target.style.borderColor = accent}
                  onBlur={e => e.target.style.borderColor = ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Dirección IP</label>
              <input
                type="text"
                value={config.ip}
                onChange={e => updateConfig('ip', e.target.value)}
                placeholder="192.168.1.100"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition"
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Puerto</label>
              <input
                type="text"
                value={config.puerto || ''}
                onChange={e => updateConfig('puerto', e.target.value)}
                placeholder="554"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition"
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className={`flex items-center gap-2 text-xs ${isConfigured ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-green-500' : 'bg-gray-300'}`} />
              {isConfigured ? 'Configuración guardada' : 'Completa todos los campos'}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Vista previa</p>
          <div className="h-[calc(100%-1.25rem)]">
            <CameraPanel accent={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}
