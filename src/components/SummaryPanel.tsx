import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Employee } from "../types";
import { calculateCosts, eligibleForDiscount } from "../utils/cost";
import { formatCurrency, formatNumber } from "../utils/format";
import { ChevronDown, ChevronUp } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981"]; // Tailwind blue & green

export default function SummaryPanel({ employees }: { employees: Employee[] }) {
  const [open, setOpen] = useState(false);
  if (!employees.length) return null;

  // Aggregate totals
  let totalEmpCost = 0;
  let totalDepCost = 0;
  let employeeCount = employees.length;
  let discountedEmployees = 0;
  let dependentCount = 0;
  let discountedDependents = 0;

  employees.forEach((emp) => {
    const empHasDiscount = eligibleForDiscount(emp.name);
    if (empHasDiscount) discountedEmployees++;

    dependentCount += emp.dependents.length;
    emp.dependents.forEach((dep) => {
      if (eligibleForDiscount(dep.name)) discountedDependents++;
    });

    const { totalYearly } = calculateCosts(emp);
    const empCost = 1000 * (empHasDiscount ? 0.9 : 1);
    const depCost = totalYearly - empCost;

    totalEmpCost += empCost;
    totalDepCost += depCost;
  });

  const totalYearly = totalEmpCost + totalDepCost;
  const perPaycheck = totalYearly / 26;
  const avgPerEmployee = totalYearly / employeeCount;

  const data = [
    { name: "Employees", value: totalEmpCost },
    { name: "Dependents", value: totalDepCost },
  ];

  return (
    <div className="sticky top-[64px] z-10 border-b bg-gray-50 shadow-sm md:static md:shadow-none">
      {/* Toggle header (mobile only) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 md:hidden"
      >
        <span>Summary</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 md:block ${
          open ? "max-h-[800px] p-4" : "max-h-0 md:max-h-none md:p-4"
        }`}
      >
        <div className="rounded-lg bg-white p-4 shadow-sm md:shadow-none">
          <h3 className="mb-2 text-lg font-semibold">Summary</h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Left column — metrics */}
            <div className="space-y-1 text-gray-700">
              <p>
                👥 <span className="font-medium">Employees:</span>{" "}
                {formatNumber(employeeCount)}
              </p>
              <p>
                💚 Employees with discount: {formatNumber(discountedEmployees)}
              </p>
              <p>
                👶 Dependents: {formatNumber(dependentCount)}
              </p>
              <p>
                💚 Dependents with discount: {formatNumber(discountedDependents)}
              </p>
              <hr className="my-2" />
              <p>
                💵 <span className="font-medium">Average per employee:</span>{" "}
                {formatCurrency(avgPerEmployee)}
              </p>
              <p>
                🧾 Employees total: {formatCurrency(totalEmpCost)}
              </p>
              <p>
                🧾 Dependents total: {formatCurrency(totalDepCost)}
              </p>
              <hr className="my-2" />
              <p>
                <span className="font-medium">Total yearly cost:</span>{" "}
                {formatCurrency(totalYearly)}
              </p>
              <p>
                <span className="font-medium">Per paycheck:</span>{" "}
                {formatCurrency(perPaycheck)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                (based on 26 pay periods per year)
              </p>
            </div>

            {/* Right column — pie chart */}
            <div className="h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
