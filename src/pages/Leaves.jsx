import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Check, X } from 'lucide-react';
import { leaves, review, cancel } from '../features/leaves/leaveSlice.js';
import { fetchMe } from '../features/auth/authSlice.js';
import { notify, fmtDate, today, cap } from '../utils/helpers.js';
import { MANAGERS } from '../config/navigation.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import Field from '../components/ui/Field.jsx';
import Badge from '../components/ui/Badge.jsx';

const TYPES = ['casual', 'sick', 'earned', 'unpaid'].map((t) => ({ value: t, label: cap(t) }));
const blank = () => ({ type: 'casual', startDate: today(), endDate: today(), reason: '' });

export default function Leaves() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const isManager = MANAGERS.includes(user.role);
  const { items, loading } = useSelector((s) => s.leaves);
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);
  useEffect(() => { dispatch(leaves.fetchAll(status ? { status } : {})); }, [dispatch, status]);

  const apply = async (e) => {
    e.preventDefault();
    if (await notify(dispatch(leaves.create(modal)), 'Leave request submitted')) setModal(null);
  };
  const decide = async (l, s) => {
    const note = s === 'rejected' ? window.prompt('Reason for rejection (optional)') : '';
    if (note === null) return;
    await notify(dispatch(review(l._id, s, note)), `Leave ${s}`);
  };
  const withdraw = (l) => window.confirm('Cancel this request?') && notify(dispatch(cancel(l._id)), 'Request cancelled');

  const columns = [
    ...(isManager ? [{ header: 'Employee', csv: (l) => l.user?.name, render: (l) => `${l.user?.name} (${l.user?.employeeId})` }] : []),
    { header: 'Type', key: 'type', render: (l) => cap(l.type) },
    { header: 'From', key: 'startDate', render: (l) => fmtDate(l.startDate) },
    { header: 'To', key: 'endDate', render: (l) => fmtDate(l.endDate) },
    { header: 'Days', key: 'days' },
    { header: 'Reason', key: 'reason', render: (l) => <span className="block max-w-[14rem] truncate" title={l.reason}>{l.reason}</span> },
    { header: 'Status', key: 'status', render: (l) => <Badge value={l.status} /> },
    { header: 'Reviewed by', csv: (l) => l.reviewedBy?.name, render: (l) => l.reviewedBy?.name || '-' },
    { header: 'Actions', noExport: true, render: (l) => {
      const own = l.user?._id === user._id;
      if (l.status !== 'pending') return l.reviewNote ? <span className="text-xs text-slate-500">{l.reviewNote}</span> : null;
      return (
        <div className="flex gap-2">
          {isManager && !own && <>
            <button className="btn btn-success btn-sm" onClick={() => decide(l, 'approved')}><Check size={13} /> Approve</button>
            <button className="btn btn-danger btn-sm" onClick={() => decide(l, 'rejected')}><X size={13} /> Reject</button>
          </>}
          {own && <button className="btn btn-secondary btn-sm" onClick={() => withdraw(l)}>Cancel</button>}
        </div>
      );
    } },
  ];

  return (
    <>
      <PageHeader title="Leave management" subtitle={isManager ? 'Review requests and apply for your own leave' : 'Apply for leave and track requests'}>
        <Field label="" className="w-40" value={status} onChange={(e) => setStatus(e.target.value)}
          options={[{ value: '', label: 'All statuses' }, ...['pending', 'approved', 'rejected', 'cancelled'].map((s) => ({ value: s, label: cap(s) }))]} />
        <button className="btn btn-primary" onClick={() => setModal(blank())}><Plus size={16} /> Apply for leave</button>
      </PageHeader>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {Object.entries(user.leaveBalance || {}).map(([k, v]) => (
          <div key={k} className="card text-center"><p className="text-3xl font-semibold">{v}</p><p className="text-sm text-slate-500">{cap(k)} leave remaining</p></div>
        ))}
      </div>

      <DataTable columns={columns} rows={items} loading={loading} exportName="leaves" />

      {modal && (
        <Modal title="Apply for leave" onClose={() => setModal(null)}>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={apply}>
            <Field label="Leave type" className="sm:col-span-2" value={modal.type} onChange={(e) => setModal({ ...modal, type: e.target.value })} options={TYPES} />
            <Field label="From" type="date" required value={modal.startDate} onChange={(e) => setModal({ ...modal, startDate: e.target.value, endDate: e.target.value > modal.endDate ? e.target.value : modal.endDate })} />
            <Field label="To" type="date" required min={modal.startDate} value={modal.endDate} onChange={(e) => setModal({ ...modal, endDate: e.target.value })} />
            <Field label="Reason" as="textarea" required className="sm:col-span-2" value={modal.reason} onChange={(e) => setModal({ ...modal, reason: e.target.value })} />
            <p className="text-xs text-slate-500 sm:col-span-2">Weekends are not counted. Approved paid leave is not deducted from salary.</p>
            <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary">Submit</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
