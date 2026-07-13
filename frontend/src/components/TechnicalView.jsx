import { useState } from 'react';
import SpeedTestPanel from './SpeedTestPanel.jsx';
import BrakeTestPanel from './BrakeTestPanel.jsx';
import { THEMES } from '../theme.js';

const TABS = [
  { id: 'speed', label: 'Velocidad' },
  { id: 'brake', label: 'Frenado' },
];

export default function TechnicalView({ autos, themeMode }) {
  const [activeTab, setActiveTab] = useState('speed');
  const accent = THEMES[themeMode].accent;

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
        <div className="flex border-b border-gray-100 px-6 pt-4">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-3 text-sm font-medium transition-all duration-200 relative cursor-pointer hover:text-gray-700 active:scale-95"
                style={{ color: isActive ? accent : '#999' }}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                       style={{ backgroundColor: accent }} />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'speed' ? (
            <SpeedTestPanel autos={autos} themeMode={themeMode} />
          ) : (
            <BrakeTestPanel autos={autos} themeMode={themeMode} />
          )}
        </div>
      </div>
    </div>
  );
}
