import { useState, useCallback } from 'react';
import useSimulatedRace from './hooks/useSimulatedRace.js';
import Sidebar from './components/Sidebar.jsx';
import EnduranceView from './components/EnduranceView.jsx';
import TechnicalView from './components/TechnicalView.jsx';
export default function App() {
  const [currentView, setCurrentView] = useState('endurance');
  const [themeMode, setThemeMode] = useState('race');

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'race' ? 'syscom' : 'race');
  }, []);

  const { autos, cronometro, leader, totalActive, sortedBySpeed, sortedByBrake } = useSimulatedRace();

  return (
    <div className="min-h-screen bg-sidebar-bg flex overflow-hidden">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        themeMode={themeMode}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 p-5 overflow-hidden">
        <div className="w-full h-full rounded-3xl p-6 shadow-2xl overflow-y-auto"
             style={{ backgroundColor: '#eeeeee' }}>
          {currentView === 'endurance' ? (
            <EnduranceView
              autos={autos}
              cronometro={cronometro}
              leader={leader}
              totalActive={totalActive}
              themeMode={themeMode}
            />
          ) : (
            <TechnicalView
              sortedBySpeed={sortedBySpeed}
              sortedByBrake={sortedByBrake}
              themeMode={themeMode}
            />
          )}
        </div>
      </main>
    </div>
  );
}
