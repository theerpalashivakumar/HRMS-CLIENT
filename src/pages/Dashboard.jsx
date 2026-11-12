import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Users, UserCheck, UserX, CalendarClock, Building2, Plane, Wallet, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../api/axios.js';
import { errMsg, fmtTime, money, cap } from '../utils/helpers.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import toast from 'react-hot-toast';

const ChartCard = ({ title, children }) => (
  <div className="card">
    <h3 className="mb-3 text-sm font-semibold">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
    </div>
  </div>
);

function OrgDashboard({ d }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total employees" value={d.totalEmployees} icon={Users} />
        <StatCard label="Present today" value={d.presentToday} icon={UserCheck} tone="emerald" />
        <StatCard label="On leave today" value={d.onLeaveToday} icon={Plane} tone="violet" />
        <StatCard label="Absent today" value={d.absentToday} icon={UserX} tone="rose" />
        <StatCard label="Pending leave requests" value={d.pendingLeaves} icon={CalendarClock} tone="amber" />
        <StatCard label="Departments" value={d.departments} icon={Building2} tone="sky" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Headcount by department">
          <BarChart data={d.departmentHeadcount}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title="Attendance - last working days">
          <LineChart data={d.attendanceTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} /><Tooltip /><Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} /></LineChart>
        </ChartCard>
        <ChartCard title="Net payroll cost by month (₹)">
          <BarChart data={d.payrollTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip formatter={(v) => money(v)} /><Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} /></BarChart>
        </ChartCard>
      </div>
    </>
  );
}

function SelfDashboard({ d }) {
  const bal = d.leaveBalance;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today" value={d.today?.checkIn ? `In ${fmtTime(d.today.checkIn)}` : 'Not checked in'} icon={Clock} tone="emerald" />
        <StatCard label="Pending leave requests" value={d.pendingLeaves} icon={CalendarClock} tone="amber" />
        <StatCard label="Latest net pay" value={d.lastPayslip ? money(d.lastPayslip.netSalary) : '-'} icon={Wallet} tone="indigo" />
        <StatCard label="Present days (this month)" value={d.monthSummary.present + d.monthSummary.late} icon={UserCheck} tone="sky" />
      </div>
      <div className="card mt-6">
        <h3 className="mb-3 text-sm font-semibold">Leave balance</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(bal).map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 p-4 text-center"><p className="text-3xl font-semibold">{v}</p><p className="text-sm text-slate-500">{cap(k)} leave</p></div>
          ))}
        </div>
      </div>
      <div className="card mt-6">
        <h3 className="mb-3 text-sm font-semibold">This month</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          {Object.entries(d.monthSummary).map(([k, v]) => <span key={k} className="rounded-lg bg-slate-50 px-3 py-2">{cap(k)}: <b>{v}</b></span>)}
          {d.today && <span className="px-3 py-2">Status today: <Badge value={d.today.status} /></span>}
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/dashboard').then((r) => setData(r.data.data)).catch((e) => toast.error(errMsg(e))); }, []);

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle={data?.scope === 'org' ? 'Organization overview' : 'Your overview'} />
      {!data ? <Spinner /> : data.scope === 'org' ? <OrgDashboard d={data} /> : <SelfDashboard d={data} />}
    </>
  );
}
