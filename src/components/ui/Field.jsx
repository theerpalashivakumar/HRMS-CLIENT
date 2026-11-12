export default function Field({ label, options, as, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {options ? (
        <select className="input" {...props}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : as === 'textarea' ? (
        <textarea className="input" rows={3} {...props} />
      ) : (
        <input className="input" {...props} />
      )}
    </label>
  );
}
