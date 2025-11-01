import { DEPENDENT_COST, DISCOUNT_FACTOR, EMPLOYEE_COST, PAY_PERIODS } from '../config';
import type { Employee } from '../types';

export function getDiscountFactor(name: string) {
  return name.trim().toLowerCase().startsWith('a') ? DISCOUNT_FACTOR : 1;
}

export function calculateCosts(employee: Employee) {
  const empCost = EMPLOYEE_COST * getDiscountFactor(employee.name);
  const depsCost = employee.dependents.reduce(
    (sum, d) => sum + DEPENDENT_COST * getDiscountFactor(d.name),
    0,
  );

  const totalYearly = empCost + depsCost;
  const perPaycheck = totalYearly / PAY_PERIODS;

  return { totalYearly, perPaycheck };
}
