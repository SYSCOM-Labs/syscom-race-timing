import MetricCard from './MetricCard.jsx';
import CarCard from './CarCard.jsx';
import { THEMES } from '../theme.js';

export default function EnduranceView({ autos, cronometro, leader, totalActive, themeMode }) {
  const accent = THEMES[themeMode].accent;

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Cronómetro" value={cronometro} accentColor={accent} large />
        <MetricCard label="Autos en Pista" value={totalActive} accentColor={accent} />
        <MetricCard
          label="Auto Líder"
          value={leader ? `${leader.matricula} (${leader.vueltas} vtas)` : '—'}
          accentColor={accent}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {autos.map(auto => (
            <CarCard key={auto.id} auto={auto} themeMode={themeMode} />
          ))}
        </div>
      </div>
    </div>
  );
}
