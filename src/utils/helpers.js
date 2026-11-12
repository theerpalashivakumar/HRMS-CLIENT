import toast from 'react-hot-toast';

export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';

/** Await a dispatched thunk, toast success/error. Resolves to the payload, or null on failure. */
export const notify = async (thunkPromise, success) => {
  try {
    const result = await thunkPromise.unwrap();
    if (success) toast.success(success);
    return result ?? true;
  } catch (e) {
    toast.error(typeof e === 'string' ? e : errMsg(e));
    return null;
  }
};

export const today = () => new Date().toLocaleDateString('en-CA');
export const thisMonth = () => today().slice(0, 7);
export const fmtDate = (s) => (s ? new Date(`${s}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-');
export const fmtTime = (d) => (d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-');
export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
export const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const exportCsv = (filename, columns, rows) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [columns.map((c) => esc(c.header)).join(',')];
  rows.forEach((r) => lines.push(columns.map((c) => esc(c.csv ? c.csv(r) : r[c.key])).join(',')));
  downloadBlob(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' }), `${filename}.csv`);
};
