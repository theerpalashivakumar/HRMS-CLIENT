import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Menu, Briefcase } from 'lucide-react';
import { NAV } from '../../config/navigation.js';
import { logout } from '../../features/auth/authSlice.js';
import Badge from '../ui/Badge.jsx';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-slate-900 text-slate-200 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center gap-2 px-5 text-lg font-semibold text-white"><Briefcase size={20} /> HRMS</div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV.filter((n) => n.roles.includes(user.role)).map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right text-sm leading-tight">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">{user.employeeId}</p>
            </div>
            <Badge value={user.role} />
            <button className="btn btn-secondary btn-sm" onClick={onLogout}><LogOut size={14} /> Logout</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
