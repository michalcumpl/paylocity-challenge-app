import { useEffect, useRef, useState } from 'react';
import type { Employee } from '../types';
import { calculateCosts } from '../utils/cost';
import { formatCurrency } from '../utils/format';

type Props = {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
  onFilter?: (query: string) => Employee[]; // 👈 external filter logic
};

const PAGE_SIZE = 20;

export default function EmployeeList({ employees, onEdit, onDelete, onFilter }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Filtered (from parent, if provided)
  const filtered = onFilter ? (onFilter('') ?? []) : employees;
  const visibleEmployees = filtered.slice(0, visibleCount);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleCount < filtered.length) {
          setVisibleCount(prev => prev + PAGE_SIZE);
        }
      },
      { rootMargin: '100px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  if (!employees.length) return null;

  return (
    <div className="mt-6">
      <div className="hidden items-center border-b text-sm font-medium text-gray-600 md:grid md:grid-cols-[2fr_2fr_1fr_auto]">
        <div className="p-2">Name</div>
        <div className="p-2">Dependents</div>
        <div className="p-2 text-right">Per Paycheck</div>
        <div className="p-2 text-right">Actions</div>
      </div>

      {visibleEmployees.map(emp => {
        const { perPaycheck, totalYearly } = calculateCosts(emp);
        const deps = emp.dependents.map(d => d.name).join(', ') || '—';

        return (
          <div
            key={emp.id}
            className="flex flex-col items-center border-b py-2 text-sm md:grid md:grid-cols-[2fr_2fr_1fr_auto]"
          >
            <div className="w-full p-2 font-medium">{emp.name}</div>
            <div className="w-full p-2 text-gray-700 md:text-left">{deps}</div>
            <div className="w-full p-2 text-right">
              {formatCurrency(perPaycheck)} <span className="text-gray-500">/paycheck</span>
              <div className="text-xs text-gray-400">{formatCurrency(totalYearly)} /yr</div>
            </div>
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

      <div ref={sentinelRef} className="h-8" />

      {visibleEmployees.length < filtered.length && (
        <p className="py-2 text-center text-sm text-gray-500">Loading more...</p>
      )}

      {!filtered.length && (
        <p className="py-4 text-center text-sm text-gray-500">No matching employees found.</p>
      )}
    </div>
  );
}
