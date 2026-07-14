import { useState, useCallback } from 'react';
import useSimulatedRace from './hooks/useSimulatedRace.js';
import Sidebar from './components/Sidebar.jsx';
import EnduranceView from './components/EnduranceView.jsx';
import TechnicalView from './components/TechnicalView.jsx';
import PilotsView from './components/PilotsView.jsx';
import RecordsView from './components/RecordsView.jsx';
import SeguridadView from './components/SeguridadView.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('endurance');
  const [themeMode, setThemeMode] = useState('race');

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'race' ? 'syscom' : 'race');
  }, []);

  const { autos, cronometro, leader, remainingMs, totalMs } = useSimulatedRace();

  return (
    <div className="h-svh bg-sidebar-bg flex overflow-hidden">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        themeMode={themeMode}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 p-5 overflow-hidden min-h-0 min-w-0">
        <div
          className={[
            'w-full h-full rounded-3xl p-6 shadow-2xl min-h-0',
            currentView === 'endurance' ? 'overflow-hidden' : 'overflow-y-auto',
          ].join(' ')}
          style={{ backgroundColor: '#eeeeee' }}
        >
          {currentView === 'seguridad' ? (
            <SeguridadView themeMode={themeMode} />
          ) : currentView === 'pilots' ? (
            <PilotsView themeMode={themeMode} />
          ) : currentView === 'records' ? (
            <RecordsView autos={autos} themeMode={themeMode} />
          ) : currentView === 'endurance' ? (
            <EnduranceView
              autos={autos}
              cronometro={cronometro}
              leader={leader}
              remainingMs={remainingMs}
              totalMs={totalMs}
              themeMode={themeMode}
            />
          ) : (
            <TechnicalView
              autos={autos}
              themeMode={themeMode}
            />
          )}
        </div>
      </main>
    </div>
  );
}
