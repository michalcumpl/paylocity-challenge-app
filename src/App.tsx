import { useState } from 'react';
import { useEmployees } from './hooks/useEmployees';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import SummaryPanel from './components/SummaryPanel';
import type { Employee } from './types.ts';

export default function App() {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployees();
  const [editing, setEditing] = useState<Employee | null>(null);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-xl font-bold">Healthcare Benefits Manager</h1>

      {editing ? (
        <EmployeeForm
          initial={editing}
          onSave={emp => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            editing.id ? updateEmployee(emp) : addEmployee(emp);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <button className="blue-button" onClick={() => setEditing({ id: '', name: '', dependents: [] })}>
          Add Employee
        </button>
      )}

      <EmployeeList employees={employees} onEdit={setEditing} onDelete={removeEmployee} />
      <SummaryPanel employees={employees} />
    </div>
  );
}
