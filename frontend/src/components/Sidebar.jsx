import { THEMES } from '../theme.js';
import syscomLogo from '../assets/syscomLargeLogoBlackLetters.webp';

function FlagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l2-5" /><path d="M12 12l-2.5 3" /></svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  );
}

const NAV_ITEMS = [
  { id: 'endurance', icon: FlagIcon, label: 'Carrera 4h' },
  { id: 'technical', icon: GaugeIcon, label: 'Pruebas Técnicas' },
  { id: 'pilots', icon: UsersIcon, label: 'Pilotos' },
  { id: 'records', icon: BarChartIcon, label: 'Records' },
];

export default function Sidebar({ currentView, setCurrentView, themeMode, toggleTheme }) {
  const theme = THEMES[themeMode];
  const isRace = themeMode === 'race';

  return (
    <aside className="w-64 bg-sidebar-bg min-h-screen flex flex-col shrink-0">
      <div className="px-2 pt-8 pb-6 flex flex-col gap-2">
        <div className="p-2 rounded-lg invert flex items-center justify-center">
          <img src={syscomLogo} alt="SYSCOM" className="h-9 w-auto object-contain" />
        </div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center mt-1">Reto Solar 2026</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'text-white font-bold shadow-md'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-nav-hover font-semibold'
                }`}
              style={{
                backgroundColor: isActive ? theme.accent : 'transparent',
              }}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>
                <Icon />
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
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
