import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileDown, Play, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { payroll, generatePayroll, markPaid } from '../features/payroll/payrollSlice.js';
import { notify, money, thisMonth, downloadBlob, errMsg } from '../utils/helpers.js';
import { MANAGERS } from '../config/navigation.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Badge from '../components/ui/Badge.jsx';

export const payrollColumns = [
  { header: 'Month', key: 'month' },
  { header: 'Employee', csv: (p) => `${p.user?.name} (${p.user?.employeeId})`, render: (p) => `${p.user?.name} (${p.user?.employeeId})` },
  { header: 'Working days', key: 'monthWorkingDays' },
  { header: 'Present', key: 'presentDays' },
  { header: 'Paid leave', key: 'paidLeaveDays' },
  { header: 'Unpaid', key: 'unpaidDays' },
  { header: 'Gross', key: 'grossEarned', render: (p) => money(p.grossEarned) },
  { header: 'Absence ded.', key: 'absentDeduction', render: (p) => money(p.absentDeduction) },
  { header: 'PF', key: 'pf', render: (p) => money(p.pf) },
  { header: 'Prof. tax', key: 'professionalTax', render: (p) => money(p.professionalTax) },
  { header: 'Net salary', key: 'netSalary', render: (p) => <b>{money(p.netSalary)}</b> },
  { header: 'Status', key: 'status', render: (p) => <Badge value={p.status} /> },
];

export default function Payroll() {
  const dispatch = useDispatch();
  const isManager = MANAGERS.includes(useSelector((s) => s.auth.user.role));
  const { items, loading } = useSelector((s) => s.payroll);
  const [month, setMonth] = useState(thisMonth());
  const [busy, setBusy] = useState(false);

  useEffect(() => { dispatch(payroll.fetchAll(isManager ? { month } : {})); }, [dispatch, month, isManager]);

  const generate = async () => {
    setBusy(true);
    const res = await notify(dispatch(generatePayroll({ month })));
    setBusy(false);
    if (res?.message) toast.success(res.message);
  };
  const pdf = async (p) => {
    try {
      const { data } = await api.get(`/payroll/${p._id}/pdf`, { responseType: 'blob' });
      downloadBlob(data, `payslip-${p.user?.employeeId}-${p.month}.pdf`);
    } catch (e) { toast.error(errMsg(e)); }
  };

  const columns = [
    ...payrollColumns.filter((c) => isManager || c.header !== 'Employee'),
    { header: 'Actions', noExport: true, render: (p) => (
      <div className="flex gap-2">
        <button className="btn btn-secondary btn-sm" onClick={() => pdf(p)}><FileDown size={13} /> Payslip</button>
        {isManager && p.status !== 'paid' && <button className="btn btn-success btn-sm" onClick={() => notify(dispatch(markPaid(p._id)), 'Marked as paid')}><BadgeCheck size={13} /> Mark paid</button>}
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader title="Payroll" subtitle={isManager ? 'Generate monthly payroll from attendance and approved leaves' : 'Your payslips'}>
        {isManager && (
          <>
            <input type="month" className="input w-40" value={month} onChange={(e) => setMonth(e.target.value)} />
            <button className="btn btn-primary" disabled={busy} onClick={generate}><Play size={15} /> {busy ? 'Generating...' : 'Generate payroll'}</button>
          </>
        )}
      </PageHeader>
      <DataTable columns={columns} rows={items} loading={loading} exportName={`payroll-${isManager ? month : 'mine'}`} />
      <p className="mt-3 text-xs text-slate-500">Net = gross earned − absence deduction − PF (12% of basic) − professional tax (₹200 if gross ≥ ₹15,000). Working days are Mon–Fri.</p>
    </>
  );
}
