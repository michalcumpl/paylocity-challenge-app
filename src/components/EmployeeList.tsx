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
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">Employees</h2>

      <div className="hidden items-center border-b text-sm font-medium text-gray-600 md:grid md:grid-cols-[2fr_2fr_1fr_auto]">
        <div className="p-2">Name</div>
        <div className="p-2">Dependents</div>
        <div className="p-2 text-right">Per Paycheck</div>
        <div className="p-2 text-right">Actions</div>
      </div>

      {employees.map(emp => {
        const { perPaycheck, totalYearly } = calculateCosts(emp);
        const deps = emp.dependents.map(d => d.name).join(', ') || '—';

        return (
          <div
            key={emp.id}
            className="flex flex-col items-center border-b py-2 text-sm md:grid md:grid-cols-[2fr_2fr_1fr_auto]"
          >
            {/* Name */}
            <div className="w-full p-2 font-medium">{emp.name}</div>

            {/* Dependents */}
            <div className="w-full p-2 text-gray-700 md:text-left">{deps}</div>

            {/* Costs */}
            <div className="w-full p-2 text-right">
              ${perPaycheck.toFixed(2)} <span className="text-gray-500">/paycheck</span>
              <div className="text-xs text-gray-400">${totalYearly.toFixed(2)} /yr</div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 p-2">
              <button
                className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                onClick={() => onEdit(emp)}
              >
                Edit
              </button>
              <button
                className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
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
