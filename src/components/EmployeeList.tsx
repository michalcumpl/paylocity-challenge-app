import { useState, useMemo, useEffect, useRef } from 'react';
import type { Employee } from '../types';
import { calculateCosts } from '../utils/cost';

type Props = {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
};

const PAGE_SIZE = 20;

export default function EmployeeList({ employees, onEdit, onDelete }: Props) {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 🔍 Filter employees by name or dependent name
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      emp =>
        emp.name.toLowerCase().includes(q) ||
        emp.dependents.some(d => d.name.toLowerCase().includes(q)),
    );
  }, [employees, query]);

  // ✂️ Slice for infinite scrolling
  const visibleEmployees = filtered.slice(0, visibleCount);

  // ⬇️ Infinite scroll observer
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Employees</h2>
        <input
          type="text"
          placeholder="Search by name or dependent..."
          className="rounded border px-2 py-1 text-sm"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE); // reset when filtering
          }}
        />
      </div>

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

      {/* Sentinel for infinite scroll */}
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
