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

  const personCount = employeeCount + dependentCount;

  const totalYearly = totalEmpCost + totalDepCost;
  const paycheckEmpCost = totalEmpCost / 26;
  const paycheckDepCost = totalDepCost / 26;
  const paycheckCost = totalYearly / 26;
  const avgEmpCostPerEmployee = totalEmpCost / employeeCount;
  const avgDepCostPerEmployee = totalDepCost / employeeCount;
  const avgCostPerEmployee = totalYearly / employeeCount;

  return (
    <div className="overflow-x-auto rounded-lg bg-white p-4 text-gray-700 shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-gray-600">
            <th className="p-2 font-semibold">Category</th>
            <th className="p-2 text-right font-semibold">Persons</th>
            <th className="p-2 text-right font-semibold">Per Paycheck</th>
            <th className="hidden p-2 text-right font-semibold sm:table-cell">Per Year</th>
            <th className="hidden p-2 text-right font-semibold sm:table-cell">Average</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-medium">Employees</td>
            <td className="p-2 text-right">{formatNumber(employeeCount)}</td>
            <td className="p-2 text-right">{formatCurrency(paycheckEmpCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">{formatCurrency(totalEmpCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(avgEmpCostPerEmployee)}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-medium">Dependents</td>
            <td className="p-2 text-right">{formatNumber(dependentCount)}</td>
            <td className="p-2 text-right">{formatCurrency(paycheckDepCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">{formatCurrency(totalDepCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(avgDepCostPerEmployee)}
            </td>
          </tr>
          <tr className="font-semibold">
            <td className="p-2">Total</td>
            <td className="p-2 text-right">{formatNumber(personCount)}</td>
            <td className="p-2 text-right">{formatCurrency(paycheckCost)}</td>
            <td className="hidden p-2 text-right sm:table-cell">{formatCurrency(totalYearly)}</td>
            <td className="hidden p-2 text-right sm:table-cell">
              {formatCurrency(avgCostPerEmployee)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
