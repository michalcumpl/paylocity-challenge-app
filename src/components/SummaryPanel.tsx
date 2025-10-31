import type { Employee } from '../types';
import { calculateCosts, EMPLOYEE_COST, getDiscountFactor, PAY_PERIODS } from '../utils/cost';
import { formatCurrency, formatNumber } from '../utils/format';

export default function SummaryPanel({ employees }: { employees: Employee[] }) {
  if (employees.length === 0) return null;

  const employeeCount = employees.length;
  let dependentCount = 0;

  let totalEmployeeYearlyCost = 0;
  let totalDependentYearlyCost = 0;

  // Calculate totals per employee
  employees.forEach(employee => {
    const { totalYearly } = calculateCosts(employee);
    const employeeYearlyCost = EMPLOYEE_COST * getDiscountFactor(employee.name);
    const dependentYearlyCost = totalYearly - employeeYearlyCost;

    dependentCount += employee.dependents.length;
    totalEmployeeYearlyCost += employeeYearlyCost;
    totalDependentYearlyCost += dependentYearlyCost;
  });

  // Derived aggregates
  const totalPersons = employeeCount + dependentCount;
  const totalYearlyCost = totalEmployeeYearlyCost + totalDependentYearlyCost;

  // Per paycheck
  const employeePaycheckCost = totalEmployeeYearlyCost / PAY_PERIODS;
  const dependentPaycheckCost = totalDependentYearlyCost / PAY_PERIODS;
  const totalPaycheckCost = totalYearlyCost / PAY_PERIODS;

  // Per employee averages
  const avgEmployeeYearlyCost = totalEmployeeYearlyCost / employeeCount;
  const avgDependentYearlyCost = totalDependentYearlyCost / employeeCount;
  const avgTotalYearlyCost = totalYearlyCost / employeeCount;

  return (
    <div className="overflow-x-auto rounded-lg bg-white p-4 text-gray-700 shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-gray-600">
            <th className="border-r border-gray-300 p-2"></th>
            <th className="p-2 text-right font-semibold">#</th>
            <th className="p-2 text-right font-semibold">Per Paycheck</th>
            <th className="hidden p-2 text-right font-semibold sm:table-cell">Per Year</th>
            <th className="hidden p-2 text-right font-semibold sm:table-cell">Average</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="border-r border-gray-300 p-2 font-semibold">Employees</td>
            <td className="p-2 text-right">{formatNumber(employeeCount)}</td>
            <td className="p-2 text-right">{formatCurrency(employeePaycheckCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(totalEmployeeYearlyCost)}
            </td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(avgEmployeeYearlyCost)}
            </td>
          </tr>

          <tr className="border-b border-gray-300">
            <td className="border-r border-gray-300 p-2 font-semibold">Dependents</td>
            <td className="p-2 text-right">{formatNumber(dependentCount)}</td>
            <td className="p-2 text-right">{formatCurrency(dependentPaycheckCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(totalDependentYearlyCost)}
            </td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(avgDependentYearlyCost)}
            </td>
          </tr>

          <tr className="font-semibold">
            <td className="border-r border-gray-300 p-2">Total</td>
            <td className="p-2 text-right">{formatNumber(totalPersons)}</td>
            <td className="p-2 text-right">{formatCurrency(totalPaycheckCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(totalYearlyCost)}
            </td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(avgTotalYearlyCost)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
