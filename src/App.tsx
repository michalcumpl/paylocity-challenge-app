import { UserPlusIcon } from '@heroicons/react/24/outline';
import { useDeferredValue, useMemo, useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import Logo from './components/Logo';
import Modal from './components/Modal';
import SummaryPanel from './components/SummaryPanel';
import { useDebounce } from './hooks/useDebounce';
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

  const debouncedQuery = useDebounce(query);

  const filteredEmployees = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return employees;

    const filtered = employees.filter(emp => emp.name.toLowerCase().includes(q));
    return filtered.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  }, [employees, debouncedQuery]);

  const deferredEmployees = useDeferredValue(filteredEmployees);

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
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container-px my-2 flex items-center justify-between gap-4 align-middle">
          <Logo className="max-w-36 min-w-36 sm:max-w-56" />
          <h1 className="text-grey text-sm text-nowrap sm:text-2xl">Healthcare Benefits</h1>
        </div>
      </header>

      <div className="space-y-4 bg-gray-100">
        <div className="container-px flex flex-col items-end">
          <button
            className="button-success mt-3 flex items-center gap-1"
            onClick={() => setEditing({ id: '', name: '', dependents: [] })}
          >
            <UserPlusIcon className="h-5 w-5" />
            Add Employee
          </button>
        </div>
        <div className="container-px mb-4">
          <SummaryPanel employees={employees} />
        </div>
      </div>

      <div className="space-y-4 bg-gray-100">
        <div className="container-px flex items-center justify-between px-6 py-3">
          <h2 className="mb-2 text-lg font-semibold">Employees</h2>
          <input
            type="search"
            placeholder="Search by name..."
            className="input-base w-auto"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>
      <main className="overflow-hidden overflow-y-auto rounded-lg bg-white">
        <div className="container-px pb-16">
          <EmployeeList
            employees={deferredEmployees}
            onEdit={setEditing}
            onDelete={removeEmployee}
          />
        </div>
      </main>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <EmployeeForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </div>
  );
}
