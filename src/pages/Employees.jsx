import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { employees } from '../features/employees/employeeSlice.js';
import { departments } from '../features/departments/departmentSlice.js';
import EmployeeForm from '../features/employees/EmployeeForm.jsx';
import { notify, fmtDate, money } from '../utils/helpers.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import Badge from '../components/ui/Badge.jsx';
import Field from '../components/ui/Field.jsx';

export default function Employees() {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);
  const { items, loading } = useSelector((s) => s.employees);
  const depts = useSelector((s) => s.departments.items);
  const [modal, setModal] = useState(null); // 'new' | employee
  const [filters, setFilters] = useState({ department: '', status: '' });

  useEffect(() => { dispatch(departments.fetchAll()); }, [dispatch]);
  useEffect(() => { dispatch(employees.fetchAll(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)))); }, [dispatch, filters]);

  const save = async (payload) => {
    const editing = modal !== 'new';
    const action = editing ? employees.update({ id: modal._id, data: payload }) : employees.create(payload);
    if (await notify(dispatch(action), editing ? 'Employee updated' : 'Employee created')) setModal(null);
  };
  const del = (e) => window.confirm(`Delete ${e.name}? All their attendance, leave and payroll records will be removed.`) && notify(dispatch(employees.remove(e._id)), 'Employee deleted');

  const columns = [
    { header: 'ID', key: 'employeeId' },
    { header: 'Name', key: 'name', render: (e) => <div><p className="font-medium">{e.name}</p><p className="text-xs text-slate-500">{e.email}</p></div>, csv: (e) => e.name },
    { header: 'Email', key: 'email', render: () => null, noExport: false, hidden: true },
    { header: 'Department', csv: (e) => e.department?.name, render: (e) => e.department?.name || '-' },
    { header: 'Designation', key: 'designation' },
    { header: 'Role', key: 'role', render: (e) => <Badge value={e.role} /> },
    { header: 'Joined', key: 'joiningDate', render: (e) => fmtDate(e.joiningDate) },
    { header: 'Monthly gross', csv: (e) => (e.salary?.basic || 0) + (e.salary?.hra || 0) + (e.salary?.allowances || 0), render: (e) => money((e.salary?.basic || 0) + (e.salary?.hra || 0) + (e.salary?.allowances || 0)) },
    { header: 'Status', key: 'status', render: (e) => <Badge value={e.status} /> },
    { header: 'Actions', noExport: true, render: (e) => (
      <div className="flex gap-2">
        <button className="btn btn-secondary btn-sm" onClick={() => setModal(e)}><Pencil size={13} /></button>
        {e._id !== me._id && <button className="btn btn-danger btn-sm" onClick={() => del(e)}><Trash2 size={13} /></button>}
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader title="Employees" subtitle="Manage employee records">
        <Field label="" className="w-44" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          options={[{ value: '', label: 'All departments' }, ...depts.map((d) => ({ value: d._id, label: d.name }))]} />
        <Field label="" className="w-36" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          options={[{ value: '', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
        <button className="btn btn-primary" onClick={() => setModal('new')}><Plus size={16} /> Add employee</button>
      </PageHeader>
      <DataTable columns={columns} rows={items} loading={loading} exportName="employees" />
      {modal && (
        <Modal wide title={modal === 'new' ? 'New employee' : `Edit ${modal.name}`} onClose={() => setModal(null)}>
          <EmployeeForm initial={modal === 'new' ? null : modal} departments={depts} isAdmin={me.role === 'admin'} onSubmit={save} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}
