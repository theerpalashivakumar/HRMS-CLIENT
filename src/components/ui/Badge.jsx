const COLORS = {
  active: 'bg-emerald-100 text-emerald-700', approved: 'bg-emerald-100 text-emerald-700', present: 'bg-emerald-100 text-emerald-700', paid: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-200 text-slate-600', cancelled: 'bg-slate-200 text-slate-600',
  pending: 'bg-amber-100 text-amber-700', late: 'bg-amber-100 text-amber-700', 'half-day': 'bg-amber-100 text-amber-700', generated: 'bg-sky-100 text-sky-700',
  rejected: 'bg-red-100 text-red-700', absent: 'bg-red-100 text-red-700',
  'on-leave': 'bg-violet-100 text-violet-700',
  admin: 'bg-rose-100 text-rose-700', hr: 'bg-indigo-100 text-indigo-700', employee: 'bg-slate-100 text-slate-700',
};

export default function Badge({ value }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${COLORS[value] || 'bg-slate-100 text-slate-700'}`}>{value}</span>;
}
