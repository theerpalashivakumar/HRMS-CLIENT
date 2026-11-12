import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, LogOut, PenLine } from 'lucide-react';
import { attendance, fetchToday, checkIn, checkOut, markAttendance } from '../features/attendance/attendanceSlice.js';
import { employees } from '../features/employees/employeeSlice.js';
import { notify, fmtDate, fmtTime, thisMonth, today } from '../utils/helpers.js';
import { MANAGERS } from '../config/navigation.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import Field from '../components/ui/Field.jsx';
import Badge from '../components/ui/Badge.jsx';

const STATUSES = ['present', 'late', 'half-day', 'absent', 'on-leave'].map((s) => ({ value: s, label: s }));

export default function Attendance() {
  const dispatch = useDispatch();
  const role = useSelector((s) => s.auth.user.role);
  const isManager = MANAGERS.includes(role);
  const { items, loading, today: rec } = useSelector((s) => s.attendance);
  const staff = useSelector((s) => s.employees.items);
  const [month, setMonth] = useState(thisMonth());
  const [userId, setUserId] = useState('');
  const [modal, setModal] = useState(null);

  const load = () => dispatch(attendance.fetchAll({ month, ...(userId && { userId }) }));
  useEffect(() => { dispatch(fetchToday()); if (isManager) dispatch(employees.fetchAll({ status: 'active' })); }, [dispatch, isManager]);
  useEffect(() => { load(); }, [month, userId]);

  const punch = async (thunk, msg) => { if (await notify(dispatch(thunk()), msg)) load(); };
  const saveMark = async (e) => {
    e.preventDefault();
    if (await notify(dispatch(markAttendance(modal)), 'Attendance saved')) { setModal(null); load(); }
  };

  const columns = [
    ...(isManager ? [{ header: 'Employee', csv: (r) => r.user?.name, render: (r) => `${r.user?.name || ''} (${r.user?.employeeId || ''})` }] : []),
    { header: 'Date', key: 'date', render: (r) => fmtDate(r.date) },
    { header: 'Check in', csv: (r) => fmtTime(r.checkIn), render: (r) => fmtTime(r.checkIn) },
    { header: 'Check out', csv: (r) => fmtTime(r.checkOut), render: (r) => fmtTime(r.checkOut) },
    { header: 'Hours', key: 'workHours' },
    { header: 'Status', key: 'status', render: (r) => <Badge value={r.status} /> },
  ];

  return (
    <>
      <PageHeader title="Attendance" subtitle="Check in/out and monthly records">
        {isManager && (
          <>
            <Field label="" className="w-52" value={userId} onChange={(e) => setUserId(e.target.value)}
              options={[{ value: '', label: 'All employees' }, ...staff.map((u) => ({ value: u._id, label: u.name }))]} />
            <button className="btn btn-secondary" onClick={() => setModal({ userId: staff[0]?._id || '', date: today(), status: 'present', checkIn: '', checkOut: '', note: '' })}><PenLine size={15} /> Mark / correct</button>
          </>
        )}
        <input type="month" className="input w-40" value={month} onChange={(e) => setMonth(e.target.value)} />
      </PageHeader>

      <div className="card mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Today · {fmtDate(today())}</p>
          <p className="mt-1 text-lg font-semibold">
            {rec?.checkIn ? `In ${fmtTime(rec.checkIn)}` : 'Not checked in'}{rec?.checkOut ? ` · Out ${fmtTime(rec.checkOut)} (${rec.workHours}h)` : ''}
            {rec && <span className="ml-3"><Badge value={rec.status} /></span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-success" disabled={!!rec?.checkIn} onClick={() => punch(checkIn, 'Checked in')}><LogIn size={16} /> Check in</button>
          <button className="btn btn-danger" disabled={!rec?.checkIn || !!rec?.checkOut} onClick={() => punch(checkOut, 'Checked out')}><LogOut size={16} /> Check out</button>
        </div>
      </div>

      <DataTable columns={columns} rows={items} loading={loading} exportName={`attendance-${month}`} />

      {modal && (
        <Modal title="Mark / correct attendance" onClose={() => setModal(null)}>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveMark}>
            <Field label="Employee" className="sm:col-span-2" value={modal.userId} onChange={(e) => setModal({ ...modal, userId: e.target.value })} options={staff.map((u) => ({ value: u._id, label: `${u.name} (${u.employeeId})` }))} />
            <Field label="Date" type="date" max={today()} required value={modal.date} onChange={(e) => setModal({ ...modal, date: e.target.value })} />
            <Field label="Status" value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })} options={STATUSES} />
            <Field label="Check in" type="time" value={modal.checkIn} onChange={(e) => setModal({ ...modal, checkIn: e.target.value })} />
            <Field label="Check out" type="time" value={modal.checkOut} onChange={(e) => setModal({ ...modal, checkOut: e.target.value })} />
            <Field label="Note" className="sm:col-span-2" value={modal.note} onChange={(e) => setModal({ ...modal, note: e.target.value })} />
            <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
