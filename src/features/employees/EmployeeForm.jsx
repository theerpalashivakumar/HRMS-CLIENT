import { useState } from 'react';
import Field from '../../components/ui/Field.jsx';
import { today } from '../../utils/helpers.js';

const blank = { name: '', email: '', password: '', role: 'employee', department: '', designation: '', phone: '', joiningDate: today(), status: 'active', basic: 0, hra: 0, allowances: 0 };

const fromEmployee = (e) => ({
  ...blank, ...e, password: '', department: e.department?._id || '',
  basic: e.salary?.basic ?? 0, hra: e.salary?.hra ?? 0, allowances: e.salary?.allowances ?? 0,
});

export default function EmployeeForm({ initial, departments, isAdmin, onSubmit, onCancel }) {
  const [f, setF] = useState(initial ? fromEmployee(initial) : blank);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const roles = ['employee', 'hr', ...(isAdmin ? ['admin'] : [])].map((r) => ({ value: r, label: r.toUpperCase() }));

  const submit = (e) => {
    e.preventDefault();
    const { basic, hra, allowances, password, ...rest } = f;
    const payload = { ...rest, salary: { basic: +basic, hra: +hra, allowances: +allowances } };
    if (password) payload.password = password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" required value={f.name} onChange={set('name')} />
      <Field label="Email" type="email" required value={f.email} onChange={set('email')} />
      <Field label={initial ? 'New password (optional)' : 'Password (blank = Welcome@123)'} type="password" minLength={6} value={f.password} onChange={set('password')} />
      <Field label="Phone" value={f.phone} onChange={set('phone')} />
      <Field label="Department" value={f.department} onChange={set('department')}
        options={[{ value: '', label: '— Select —' }, ...departments.map((d) => ({ value: d._id, label: d.name }))]} />
      <Field label="Designation" value={f.designation} onChange={set('designation')} />
      <Field label="Role" value={f.role} onChange={set('role')} options={roles} />
      <Field label="Status" value={f.status} onChange={set('status')} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
      <Field label="Joining date" type="date" required value={f.joiningDate} onChange={set('joiningDate')} />
      <div />
      <Field label="Basic (₹/month)" type="number" min="0" value={f.basic} onChange={set('basic')} />
      <Field label="HRA (₹/month)" type="number" min="0" value={f.hra} onChange={set('hra')} />
      <Field label="Allowances (₹/month)" type="number" min="0" value={f.allowances} onChange={set('allowances')} />
      <div className="flex items-end justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary">{initial ? 'Save changes' : 'Create employee'}</button>
      </div>
    </form>
  );
}
