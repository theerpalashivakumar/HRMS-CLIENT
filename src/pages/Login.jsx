import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase } from 'lucide-react';
import { login } from '../features/auth/authSlice.js';
import { notify } from '../utils/helpers.js';
import Field from '../components/ui/Field.jsx';

const DEMO = [
  ['Admin', 'admin@hrms.com', 'Admin@123'],
  ['HR', 'hr@hrms.com', 'Hr@12345'],
  ['Employee', 'ravi@hrms.com', 'Emp@12345'],
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.auth.loading);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white"><Briefcase /></div>
          <h1 className="text-2xl font-semibold">HRMS</h1>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); notify(dispatch(login(form)), 'Welcome back!'); }}>
          <Field label="Email" type="email" required value={form.email} onChange={set('email')} />
          <Field label="Password" type="password" required value={form.password} onChange={set('password')} />
          <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="mt-6 border-t pt-4">
          <p className="mb-2 text-xs font-medium text-slate-500">Demo accounts (click to fill)</p>
          <div className="flex gap-2">
            {DEMO.map(([label, email, password]) => (
              <button key={label} type="button" className="btn btn-secondary btn-sm flex-1" onClick={() => setForm({ email, password })}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
