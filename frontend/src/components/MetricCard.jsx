export default function MetricCard({ label, value, accentColor, large = false }) {
  return (
    <div className="bg-card-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-bold ${large ? 'text-3xl md:text-4xl' : 'text-2xl'} leading-none`}
         style={{ color: accentColor }}>
        {value}
      </p>
    </div>
  );
}
