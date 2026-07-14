import { useState, useCallback } from 'react';
import { Toaster } from 'sileo';
import useSimulatedRace from './hooks/useSimulatedRace.js';
import Sidebar from './components/Sidebar.jsx';
import EnduranceView from './components/EnduranceView.jsx';
import TechnicalView from './components/TechnicalView.jsx';
import PilotsView from './components/PilotsView.jsx';
import RecordsView from './components/RecordsView.jsx';
import SeguridadView from './components/SeguridadView.jsx';
import CameraView from './components/CameraView.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('endurance');
  const [themeMode, setThemeMode] = useState('race');

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'race' ? 'syscom' : 'race');
  }, []);

  const { autos, cronometro, leader, remainingMs, totalMs, isRunning, toggleRace } = useSimulatedRace();

  return (
    <div className="h-svh bg-sidebar-bg flex overflow-hidden">
      <Toaster
        position="top-right"
        options={{
          fill: '#171717',
          roundness: 16,
          styles: {
            title: 'text-white!',
            description: 'text-white/75!',
            badge: 'bg-white/10!',
            button: 'bg-white/10! hover:bg-white/15! text-white!',
          },
        }}
      />
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
          ) : currentView === 'camera' ? (
            <CameraView themeMode={themeMode} />
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
              isRunning={isRunning}
              onToggleRace={toggleRace}
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
