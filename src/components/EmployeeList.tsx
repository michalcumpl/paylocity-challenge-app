import type { Employee } from '../types';
import { calculateCosts } from '../utils/cost';

type Props = {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
};

export default function EmployeeList({ employees, onEdit, onDelete }: Props) {
  if (!employees.length) return null;

  return (
    <div>
      <h2>Employees</h2>
      {employees.map(emp => {
        const { perPaycheck, totalYearly } = calculateCosts(emp);
        return (
          <div key={emp.id} className="mb-2 rounded border p-2">
            <div>
              <strong>{emp.name}</strong> — ${perPaycheck.toFixed(2)} / paycheck
            </div>
            <div>Dependents: {emp.dependents.map(d => d.name).join(', ') || 'None'}</div>
            <small>Yearly: ${totalYearly.toFixed(2)}</small>
            <div className="my-2 space-x-2">
              <button
                className="blue-button"
                onClick={() => onEdit(emp)}
              >
                Edit
              </button>
              <button
                className="rounded bg-red-500 px-3 py-1 text-white"
                onClick={() => onDelete(emp.id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
