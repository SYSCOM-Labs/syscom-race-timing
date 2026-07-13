import { THEMES } from '../theme.js';

const NAV_ITEMS = [
  { id: 'endurance', icon: '🏁', label: 'Carrera 4h' },
  { id: 'technical', icon: '⚡', label: 'Pruebas Técnicas' },
];

export default function Sidebar({ currentView, setCurrentView, themeMode, toggleTheme }) {
  const theme = THEMES[themeMode];
  const isRace = themeMode === 'race';

  return (
    <aside className="w-64 bg-sidebar-bg min-h-screen flex flex-col shrink-0 border-r border-white/5">
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm"
               style={{ backgroundColor: theme.accent }}>
            S
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">SYSCOM</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Reto Solar 2026</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-nav-hover'
              }`}
              style={{
                backgroundColor: isActive ? theme.accent + '20' : 'transparent',
                borderLeft: isActive ? `3px solid ${theme.accent}` : '3px solid transparent',
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6 mt-auto">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-nav-hover transition-all duration-200"
        >
          <span className="text-xs text-gray-500 uppercase tracking-wider">Tema</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium transition-colors duration-300 ${isRace ? 'text-gray-500' : 'text-white'}`}
                  style={{ color: !isRace ? theme.accent : undefined }}>
              SYSCOM
            </span>
            <div className={`w-9 h-5 rounded-full flex items-center transition-all duration-300 px-0.5`}
                 style={{ backgroundColor: theme.accent + '40' }}>
              <div className={`w-4 h-4 rounded-full transition-all duration-300 shadow-sm`}
                   style={{
                     backgroundColor: theme.accent,
                     transform: isRace ? 'translateX(0)' : 'translateX(16px)',
                   }} />
            </div>
            <span className={`text-xs font-medium transition-colors duration-300 ${isRace ? 'text-white' : 'text-gray-500'}`}
                  style={{ color: isRace ? theme.accent : undefined }}>
              RACE
            </span>
          </div>
        </button>
        <p className="text-[10px] text-gray-600 text-center mt-4">&copy; 2026 SYSCOM</p>
      </div>
    </aside>
  );
}
