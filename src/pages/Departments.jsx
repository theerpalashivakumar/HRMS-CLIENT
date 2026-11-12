import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { departments } from '../features/departments/departmentSlice.js';
import { employees } from '../features/employees/employeeSlice.js';
import { notify } from '../utils/helpers.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import Field from '../components/ui/Field.jsx';

const EMPTY = { name: '', description: '', head: '' };

export default function Departments() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.departments);
  const staff = useSelector((s) => s.employees.items);
  const [modal, setModal] = useState(null); // null | form object
  useEffect(() => { dispatch(departments.fetchAll()); dispatch(employees.fetchAll()); }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    const { _id, ...data } = modal;
    const action = _id ? departments.update({ id: _id, data }) : departments.create(data);
    if (await notify(dispatch(action), _id ? 'Department updated' : 'Department created')) setModal(null);
  };
  const del = (d) => window.confirm(`Delete department "${d.name}"?`) && notify(dispatch(departments.remove(d._id)), 'Department deleted');

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Description', key: 'description' },
    { header: 'Head', render: (d) => d.head?.name || '-' },
    { header: 'Employees', key: 'employeeCount' },
    { header: 'Actions', noExport: true, render: (d) => (
      <div className="flex gap-2">
        <button className="btn btn-secondary btn-sm" onClick={() => setModal({ _id: d._id, name: d.name, description: d.description || '', head: d.head?._id || '' })}><Pencil size={13} /></button>
        <button className="btn btn-danger btn-sm" onClick={() => del(d)}><Trash2 size={13} /></button>
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader title="Departments" subtitle="Organization structure">
        <button className="btn btn-primary" onClick={() => setModal(EMPTY)}><Plus size={16} /> Add department</button>
      </PageHeader>
      <DataTable columns={columns} rows={items} loading={loading} />
      {modal && (
        <Modal title={modal._id ? 'Edit department' : 'New department'} onClose={() => setModal(null)}>
          <form className="space-y-4" onSubmit={submit}>
            <Field label="Name" required value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} />
            <Field label="Description" as="textarea" value={modal.description} onChange={(e) => setModal({ ...modal, description: e.target.value })} />
            <Field label="Department head" value={modal.head} onChange={(e) => setModal({ ...modal, head: e.target.value })}
              options={[{ value: '', label: '— None —' }, ...staff.map((u) => ({ value: u._id, label: `${u.name} (${u.employeeId})` }))]} />
            <div className="flex justify-end gap-2"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
