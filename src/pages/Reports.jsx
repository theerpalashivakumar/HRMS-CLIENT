import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios.js';
import { payroll } from '../features/payroll/payrollSlice.js';
import { payrollColumns } from './Payroll.jsx';
import { thisMonth, money, errMsg } from '../utils/helpers.js';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { Wallet, Users } from 'lucide-react';

const attendanceColumns = [
  { header: 'ID', key: 'employeeId' }, { header: 'Employee', key: 'name' }, { header: 'Department', key: 'department' },
  { header: 'Present', key: 'present' }, { header: 'Late', key: 'late' }, { header: 'Half-day', key: 'halfDay' },
  { header: 'On leave', key: 'onLeave' }, { header: 'Absent', key: 'absent' }, { header: 'Hours', key: 'hours' },
];

export default function Reports() {
  const dispatch = useDispatch();
  const pay = useSelector((s) => s.payroll);
  const [month, setMonth] = useState(thisMonth());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/attendance/summary', { params: { month } })
      .then((r) => setRows(r.data.data)).catch((e) => toast.error(errMsg(e))).finally(() => setLoading(false));
    dispatch(payroll.fetchAll({ month }));
  }, [month, dispatch]);

  const total = pay.items.reduce((s, p) => s + p.netSalary, 0);

  return (
    <>
      <PageHeader title="Reports" subtitle="Monthly attendance and payroll reports (export to CSV)">
        <input type="month" className="input w-40" value={month} onChange={(e) => setMonth(e.target.value)} />
      </PageHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Employees in report" value={rows.length} icon={Users} />
        <StatCard label="Total net payroll" value={money(total)} icon={Wallet} tone="amber" />
      </div>
      <h2 className="mb-2 font-semibold">Attendance summary</h2>
      <DataTable columns={attendanceColumns} rows={rows} loading={loading} exportName={`attendance-summary-${month}`} />
      <h2 className="mb-2 mt-8 font-semibold">Payroll report</h2>
      <DataTable columns={payrollColumns} rows={pay.items} loading={pay.loading} exportName={`payroll-report-${month}`} empty="No payroll generated for this month" />
    </>
  );
}
