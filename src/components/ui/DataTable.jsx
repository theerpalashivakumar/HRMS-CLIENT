import { useMemo, useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import Spinner from './Spinner.jsx';
import { exportCsv } from '../../utils/helpers.js';

/** columns: [{ header, key?, render?(row), csv?(row), noExport? }] — search, pagination and CSV export built in. */
export default function DataTable({ columns, rows = [], loading, pageSize = 10, exportName, empty = 'No records found' }) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [q, rows.length]);

  const visibleColumns = useMemo(() => columns.filter((c) => !c.hidden), [columns]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(term)) : rows;
  }, [rows, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="card p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input className="input pl-9" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {exportName && (
          <button className="btn btn-secondary btn-sm" disabled={!filtered.length}
            onClick={() => exportCsv(exportName, columns.filter((c) => !c.noExport), filtered)}>
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>
      {loading ? <Spinner /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>{visibleColumns.map((c) => <th key={c.header} className="px-4 py-3 font-medium">{c.header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slice.length === 0 && <tr><td colSpan={visibleColumns.length} className="px-4 py-10 text-center text-slate-400">{empty}</td></tr>}
              {slice.map((r, i) => (
                <tr key={r._id || i} className="hover:bg-slate-50">
                  {visibleColumns.map((c) => <td key={c.header} className="whitespace-nowrap px-4 py-3">{c.render ? c.render(r) : r[c.key] ?? '-'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
        <span>{filtered.length} record(s)</span>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} / {pages}</span>
          <button className="btn btn-secondary btn-sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
