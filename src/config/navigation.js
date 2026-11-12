import { LayoutDashboard, Users, Building2, Clock, CalendarOff, Wallet, BarChart3, UserCircle } from 'lucide-react';

export const MANAGERS = ['admin', 'hr'];
export const ALL = ['admin', 'hr', 'employee'];

export const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ALL, end: true },
  { to: '/employees', label: 'Employees', icon: Users, roles: MANAGERS },
  { to: '/departments', label: 'Departments', icon: Building2, roles: MANAGERS },
  { to: '/attendance', label: 'Attendance', icon: Clock, roles: ALL },
  { to: '/leaves', label: 'Leaves', icon: CalendarOff, roles: ALL },
  { to: '/payroll', label: 'Payroll', icon: Wallet, roles: ALL },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: MANAGERS },
  { to: '/profile', label: 'My Profile', icon: UserCircle, roles: ALL },
];
