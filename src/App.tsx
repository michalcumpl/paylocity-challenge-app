import { useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import Header from './components/Header';
import SummaryPanel from './components/SummaryPanel';
import { useEmployees } from './hooks/useEmployees';
import Modal from './components/Modal';
import type { Employee } from './types';

export default function App() {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployees();
  const [editing, setEditing] = useState<Employee | null>(null);

  const handleSave = (emp: Employee) => {
    editing?.id ? updateEmployee(emp) : addEmployee(emp);
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-7xl min-w-xs px-6">
      <Header />

      <SummaryPanel employees={employees} />

      <button
        className="blue-button mt-4"
        onClick={() => setEditing({ id: '', name: '', dependents: [] })}
      >
        ➕ Add Employee
      </button>

      <EmployeeList employees={employees} onEdit={setEditing} onDelete={removeEmployee} />

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <EmployeeForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </div>
  );
}
