import { useState } from 'react';
import SpeedTestPanel from './SpeedTestPanel.jsx';
import BrakeTestPanel from './BrakeTestPanel.jsx';
import { THEMES } from '../theme.js';

const TABS = [
  {
    id: 'speed',
    label: 'Prueba de Velocidad',
    shortLabel: 'Velocidad',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    description: 'Mide el tiempo que tarda el vehículo en recorrer la distancia de velocidad.',
  },
  {
    id: 'brake',
    label: 'Prueba de Frenado',
    shortLabel: 'Frenado',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    ),
    description: 'Mide la distancia y el tiempo de detención total del vehículo.',
  },
];

export default function TechnicalView({ autos, themeMode }) {
  const [activeTab, setActiveTab] = useState('speed');
  const accent = THEMES[themeMode].accent;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header con selector de prueba */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="flex">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1.5 px-6 py-4 text-sm font-semibold transition-all duration-300 relative cursor-pointer group"
                style={{
                  color: isActive ? accent : '#9ca3af',
                  backgroundColor: isActive ? accent + '08' : 'transparent',
                }}
              >
                {/* Active left border indicator */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: accent }}
                  />
                )}
                <div
                  className="flex items-center gap-2.5 transition-transform duration-200 group-hover:scale-105"
                  style={{ color: isActive ? accent : '#9ca3af' }}
                >
                  <div
                    className="p-2 rounded-lg transition-colors duration-300"
                    style={{ backgroundColor: isActive ? accent + '15' : 'transparent' }}
                  >
                    {tab.icon}
                  </div>
                  <span className="font-bold text-sm">{tab.shortLabel}</span>
                </div>
                <span className="text-[10px] font-normal opacity-70 hidden md:block text-center leading-tight px-2">
                  {tab.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido del panel activo */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'speed' ? (
          <SpeedTestPanel autos={autos} themeMode={themeMode} />
        ) : (
          <BrakeTestPanel autos={autos} />
        )}
      </div>
    </div>
  );
}
