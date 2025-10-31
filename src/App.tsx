/** eslint-disable @typescript-eslint/no-unused-expressions */
import { useMemo, useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import Header from './components/Header';
import Modal from './components/Modal';
import SummaryPanel from './components/SummaryPanel';
import { useEmployees } from './hooks/useEmployees';
import type { Employee } from './types';

export default function App() {
  const { employees, addEmployee, updateEmployee, removeEmployee, loading } = useEmployees();
  const [editing, setEditing] = useState<Employee | null>(null);
  const [query, setQuery] = useState('');

  const handleSave = (emp: Employee) => {
    if (editing?.id) {
      updateEmployee(emp);
    } else {
      addEmployee(emp);
    }
    setEditing(null);
  };

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = employees;
    if (q) {
      list = employees.filter(
        emp =>
          emp.name.toLowerCase().includes(q) ||
          emp.dependents.some(d => d.name.toLowerCase().includes(q)),
      );
    }
    return [...list].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  }, [employees, query]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-600">Loading employees…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Header />
        </div>
      </header>

      {/* Sticky Summary */}
      <div className="sticky top-[64px] z-10 bg-gray-50 shadow-inner">
        <div className="mx-auto flex max-w-7xl flex-col items-end px-6 py-2">
          <button
            className="blue-button mt-3"
            onClick={() => setEditing({ id: '', name: '', dependents: [] })}
          >
            ➕ Add Employee
          </button>
          <SummaryPanel employees={employees} />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Employees</h2>
        <input
          type="text"
          placeholder="Search by name or dependent..."
          className="rounded border px-2 py-1 text-sm"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      {/* Scrollable Employee List */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <EmployeeList
            employees={filteredEmployees}
            onEdit={setEditing}
            onDelete={removeEmployee}
          />
        </div>
      </main>

      {/* Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <EmployeeForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </div>
  );
}
