const TONES = {
  indigo: 'bg-indigo-100 text-indigo-600', emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600', rose: 'bg-rose-100 text-rose-600',
  violet: 'bg-violet-100 text-violet-600', sky: 'bg-sky-100 text-sky-600',
};

export default function StatCard({ label, value, icon: Icon, tone = 'indigo' }) {
  return (
    <div className="card flex items-center gap-4">
      {Icon && <div className={`rounded-lg p-3 ${TONES[tone]}`}><Icon size={22} /></div>}
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
