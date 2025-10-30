import type { Employee } from '../types';
import { calculateCosts } from '../utils/cost';

export default function SummaryPanel({ employees }: { employees: Employee[] }) {
  if (!employees.length) return null;

  const totalYearly = employees.reduce((sum, e) => sum + calculateCosts(e).totalYearly, 0);
  const perPaycheck = totalYearly / 26;

  return (
    <div className="mt-4 border-t pt-2">
      <h3>Summary</h3>
      <p>Total yearly cost: ${totalYearly.toFixed(2)}</p>
      <p>Total per paycheck: ${perPaycheck.toFixed(2)}</p>
    </div>
  );
}
