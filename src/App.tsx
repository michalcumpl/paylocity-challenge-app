import { ChevronDownIcon, UserPlusIcon } from '@heroicons/react/24/outline';
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
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployees();
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

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container-px my-2 flex items-center justify-between gap-4 align-middle">
          <Logo className="max-w-36 min-w-36 sm:max-w-56" />
          <h1 className="text-grey text-sm text-nowrap sm:text-2xl">Healthcare Benefits</h1>
        </div>
      </header>

      <div className="bg-gray-50">
        <details open className="group">
          <summary className="focus-visible:-outline-offset-5 container-px flex cursor-pointer items-center justify-between py-3 select-none">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              Summary
              <ChevronDownIcon className="size-5 transition-transform group-open:rotate-180" />
            </h2>

            <button
              className="button-base flex items-center gap-1"
              onClick={() => setEditing({ id: '', name: '', dependents: [] })}
            >
              <UserPlusIcon className="size-5" />
              Add Employee
            </button>
          </summary>

          <div className="container-px my-1">
            <SummaryPanel employees={employees} />
          </div>
        </details>
      </div>

      <div className="space-y-4 bg-gray-50">
        <div className="container-px flex items-center justify-between px-6 py-3">
          <h2 className="text-lg font-semibold">Employees</h2>
          <input
            type="search"
            id="employee-search"
            placeholder="Search by name..."
            className="input-base h-[34px] w-auto"
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
