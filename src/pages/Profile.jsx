import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword } from '../features/auth/authSlice.js';
import { notify, fmtDate, money } from '../utils/helpers.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import Field from '../components/ui/Field.jsx';
import Badge from '../components/ui/Badge.jsx';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [info, setInfo] = useState({ name: user.name, phone: user.phone || '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const gross = (user.salary?.basic || 0) + (user.salary?.hra || 0) + (user.salary?.allowances || 0);

  const savePw = async (e) => {
    e.preventDefault();
    if (await notify(dispatch(changePassword(pw)), 'Password changed')) setPw({ currentPassword: '', newPassword: '' });
  };

  return (
    <>
      <PageHeader title="My profile" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 font-semibold">Employment details</h3>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-slate-500">Employee ID</dt><dd>{user.employeeId}</dd>
            <dt className="text-slate-500">Email</dt><dd>{user.email}</dd>
            <dt className="text-slate-500">Role</dt><dd><Badge value={user.role} /></dd>
            <dt className="text-slate-500">Department</dt><dd>{user.department?.name || '-'}</dd>
            <dt className="text-slate-500">Designation</dt><dd>{user.designation || '-'}</dd>
            <dt className="text-slate-500">Joined</dt><dd>{fmtDate(user.joiningDate)}</dd>
            <dt className="text-slate-500">Monthly gross</dt><dd>{money(gross)}</dd>
          </dl>
        </div>
        <form className="card space-y-4" onSubmit={async (e) => { e.preventDefault(); await notify(dispatch(updateProfile(info)), 'Profile updated'); }}>
          <h3 className="font-semibold">Edit profile</h3>
          <Field label="Name" required value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
          <Field label="Phone" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
          <button className="btn btn-primary">Save</button>
        </form>
        <form className="card space-y-4" onSubmit={savePw}>
          <h3 className="font-semibold">Change password</h3>
          <Field label="Current password" type="password" required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          <Field label="New password" type="password" required minLength={6} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <button className="btn btn-primary">Update password</button>
        </form>
      </div>
    </>
  );
}
