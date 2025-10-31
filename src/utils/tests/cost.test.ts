import type { Employee } from '../../types';
import { calculateCosts, getDiscountFactor } from '../cost';

describe('getDiscountFactor', () => {
  it('returns 0.9 for names starting with A', () => {
    expect(getDiscountFactor('Alice')).toBe(0.9);
    expect(getDiscountFactor('adam')).toBe(0.9);
  });

  it('returns 1 for others', () => {
    expect(getDiscountFactor('Bob')).toBe(1);
    expect(getDiscountFactor('charlie')).toBe(1);
  });

  it('trims whitespace and ignores case', () => {
    expect(getDiscountFactor('  anna ')).toBe(0.9);
    expect(getDiscountFactor('  Brian')).toBe(1);
  });
});

describe('calculateCosts', () => {
  const mockEmployee = (name: string, deps: string[] = []): Employee => ({
    id: '1',
    name,
    dependents: deps.map((d, i) => ({ id: `d${i}`, name: d })),
  });

  it('calculates cost with no dependents', () => {
    const { totalYearly, perPaycheck } = calculateCosts(mockEmployee('Bob'));
    expect(totalYearly).toBe(1000);
    expect(perPaycheck).toBeCloseTo(1000 / 26);
  });

  it('applies discount to employee with name starting with A', () => {
    const { totalYearly } = calculateCosts(mockEmployee('Alice'));
    expect(totalYearly).toBeCloseTo(900);
  });

  it('adds dependent costs correctly', () => {
    const { totalYearly } = calculateCosts(mockEmployee('Bob', ['Carl', 'Diana']));
    expect(totalYearly).toBe(1000 + 500 + 500);
  });

  it('applies discount to dependents starting with A', () => {
    const { totalYearly } = calculateCosts(mockEmployee('Bob', ['Anna', 'Eli']));
    expect(totalYearly).toBeCloseTo(1000 + 450 + 500);
  });

  it('handles both employee and dependent discounts', () => {
    const { totalYearly } = calculateCosts(mockEmployee('Alice', ['Aaron']));
    expect(totalYearly).toBeCloseTo(1350);
  });
});
