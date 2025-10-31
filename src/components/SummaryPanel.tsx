import type { Employee } from '../types';
import { calculateCosts, getDiscountFactor } from '../utils/cost';
import { formatCurrency, formatNumber } from '../utils/format';

export default function SummaryPanel({ employees }: { employees: Employee[] }) {
  if (!employees.length) return null;

  const employeeCount = employees.length;
  let totalEmpCost = 0;
  let totalDepCost = 0;
  let dependentCount = 0;

  employees.forEach(emp => {
    const { totalYearly } = calculateCosts(emp);
    const empCost = 1000 * getDiscountFactor(emp.name);
    const depCost = totalYearly - empCost;
    dependentCount += emp.dependents.length;
    totalEmpCost += empCost;
    totalDepCost += depCost;
  });

  const totalYearly = totalEmpCost + totalDepCost;
  const perPaycheck = totalYearly / 26;
  const avgPerEmployee = totalYearly / employeeCount;

  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      <div className="w-full space-y-1 rounded-lg bg-white p-4 text-gray-700 shadow-sm sm:w-auto">
        <h3 className="mb-2 text-lg font-semibold">Summary</h3>
        <p className="font-medium">Employees: {formatNumber(employeeCount)}</p>
        <p>Dependents: {formatNumber(dependentCount)}</p>
      </div>

      <div className="space-y-1 rounded-lg bg-white p-4 text-gray-700 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold">Per Paycheck</h3>
        <p className="font-medium">Total: {formatCurrency(perPaycheck)}</p>
        <p>Employee average: {formatCurrency(avgPerEmployee)}</p>
      </div>

      <div className="hidden space-y-1 rounded-lg bg-white p-4 text-gray-700 shadow-sm sm:block">
        <h3 className="mb-2 text-lg font-semibold">Yearly Costs</h3>
        <p className="font-medium">Total: {formatCurrency(totalYearly)}</p>
        <p>Employees: {formatCurrency(totalEmpCost)}</p>
        <p>Dependents: {formatCurrency(totalDepCost)}</p>
      </div>
    </div>
  );
}
