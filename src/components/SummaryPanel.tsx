import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Employee } from '../types';
import { calculateCosts } from '../utils/cost';
import { formatCurrency } from '../utils/format';

const COLORS = ['#3b82f6', '#10b981']; // Tailwind blue & green

export default function SummaryPanel({ employees }: { employees: Employee[] }) {
  if (!employees.length) return null;

  // Aggregate totals
  let totalEmpCost = 0;
  let totalDepCost = 0;

  employees.forEach(emp => {
    const { totalYearly } = calculateCosts(emp);
    const empCost = 1000 * (emp.name.trim().toLowerCase().startsWith('a') ? 0.9 : 1);
    const depCost = totalYearly - empCost;
    totalEmpCost += empCost;
    totalDepCost += depCost;
  });

  const totalYearly = totalEmpCost + totalDepCost;
  const perPaycheck = totalYearly / 26;

  const data = [
    { name: 'Employees', value: totalEmpCost },
    { name: 'Dependents', value: totalDepCost },
  ];

  return (
    <div className="mt-8 rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">Summary</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-gray-700">
            <span className="font-medium">Total yearly cost:</span> {formatCurrency(totalYearly)}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Total per paycheck:</span> {formatCurrency(perPaycheck)}
          </p>
          <p className="mt-2 text-sm text-gray-500">(based on 26 pay periods per year)</p>
        </div>

        <div className="h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => formatCurrency(v as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
