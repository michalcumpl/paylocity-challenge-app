import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import type { Employee } from '../types';
import { calculateCosts } from '../utils/cost';
import { formatCurrency } from '../utils/format';
import { LIST_PAGE_SIZE } from '../config';

type Props = {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
};

export default function EmployeeList({ employees, onEdit, onDelete }: Props) {
  const [visibleCount, setVisibleCount] = useState(LIST_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const visibleEmployees = employees.slice(0, visibleCount);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < employees.length) {
          setVisibleCount(prev => prev + LIST_PAGE_SIZE);
        }
      },
      { rootMargin: '100px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, employees.length]);

  if (!employees.length)
    return <div className="py-8 text-center text-gray-500">No matching employees found.</div>;

  return (
    <div className="w-full text-sm">
      {/* Desktop header */}
      <div className="sticky top-0 z-10 hidden border-b border-gray-400 bg-white font-medium text-gray-600 sm:grid sm:grid-cols-4">
        <div className="px-2 py-2">Name</div>
        <div className="px-2 py-2">Dependents</div>
        <div className="px-2 py-2 text-right">Costs</div>
        <div className="px-2 py-2 text-right">Actions</div>
      </div>

      {visibleEmployees.map(emp => {
        const { perPaycheck, totalYearly } = calculateCosts(emp);
        const deps = emp.dependents.map(d => d.name).join(', ') || '—';

        return (
          <div
            key={emp.id}
            className="border-b border-gray-300 py-2 sm:grid sm:grid-cols-4 sm:items-center"
          >
            {/* Mobile layout */}
            <div className="flex w-full items-center justify-between px-2 sm:hidden">
              <div className="flex flex-col">
                <span className="font-medium">{emp.name}</span>
                <span className="text-gray-700">{deps}</span>
                <span className="text-gray-900">
                  {formatCurrency(perPaycheck)} <span className="text-gray-500">/paycheck</span>
                </span>
                <span className="text-gray-900">
                  {formatCurrency(totalYearly)} <span className="text-gray-500">/yr</span>
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  className="button-success border-none p-2"
                  aria-label="Edit employee"
                  onClick={() => onEdit(emp)}
                >
                  <PencilSquareIcon className="size-5" aria-hidden="true" />
                </button>
                <button
                  className="button-danger border-none p-2"
                  aria-label="Remove employee"
                  onClick={() => onDelete(emp.id)}
                >
                  <TrashIcon className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden px-2 text-center font-medium sm:block sm:text-left">
              {emp.name}
            </div>
            <div className="hidden px-2 text-center text-gray-700 sm:block sm:text-left">
              {deps}
            </div>
            <div className="hidden px-2 text-center sm:block sm:text-right">
              <div>
                {formatCurrency(perPaycheck)} <span className="text-gray-500">/paycheck</span>
              </div>
              <div>
                {formatCurrency(totalYearly)} <span className="text-gray-500">/yr</span>
              </div>
            </div>
            <div className="hidden justify-end sm:flex">
              <button
                className="button-success border-none p-2"
                aria-label="Edit employee"
                onClick={() => onEdit(emp)}
              >
                <PencilSquareIcon className="size-5" aria-hidden="true" />
              </button>
              <button
                className="button-danger border-none p-2"
                aria-label="Remove employee"
                onClick={() => onDelete(emp.id)}
              >
                <TrashIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}

      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}
