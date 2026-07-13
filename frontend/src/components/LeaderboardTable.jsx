import { THEMES } from '../theme.js';

function getPositionStyle(pos, accent) {
  if (pos === 1) return { bg: accent + '15', border: `2px solid ${accent}`, textColor: accent };
  if (pos === 2) return { bg: '#f8f8f8', border: '1px solid #e5e5e5', textColor: '#555' };
  if (pos === 3) return { bg: '#f8f8f8', border: '1px solid #e5e5e5', textColor: '#555' };
  return { bg: 'transparent', border: '1px solid transparent', textColor: '#888' };
}

export default function LeaderboardTable({ data, sortKey, themeMode }) {
  const accent = THEMES[themeMode].accent;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">#</th>
            <th className="text-left py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Matrícula</th>
            <th className="text-left py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Equipo</th>
            <th className="text-right py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              {sortKey === 'velocidadMaxima' ? 'Velocidad Máx' : 'Distancia Frenado'}
            </th>
            <th className="text-right py-3 px-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">Unidad</th>
          </tr>
        </thead>
        <tbody>
          {data.map((auto, index) => {
            const pos = index + 1;
            const style = getPositionStyle(pos, accent);
            return (
              <tr
                key={auto.id}
                className="transition-all duration-300 hover:bg-gray-50"
                style={{ backgroundColor: style.bg }}
              >
                <td className="py-3 px-4 font-bold text-base" style={{ color: style.textColor }}>
                  {pos <= 3 ? (
                    <span className="text-sm font-black" style={{ color: pos === 1 ? accent : '#666' }}>#{pos}</span>
                  ) : (
                    <span className="text-gray-400">#{pos}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded"
                        style={{ backgroundColor: accent }}>
                    {auto.matricula}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700 font-medium">{auto.equipo}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-lg"
                    style={{ color: pos === 1 ? style.textColor : '#333' }}>
                  {sortKey === 'velocidadMaxima' ? auto.velocidadMaxima.toFixed(1) : auto.frenadoMetros.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-[10px] text-gray-400 font-medium">
                  {sortKey === 'velocidadMaxima' ? 'km/h' : 'm'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
