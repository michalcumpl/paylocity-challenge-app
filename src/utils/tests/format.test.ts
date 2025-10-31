import { formatCurrency } from '../format';

describe('formatCurrency', () => {
  it('formats USD amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });

  it('handles zero and negative values', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-1234.5)).toBe('-$1,234.50');
  });

  it('accepts custom currency (EUR)', () => {
    const result = formatCurrency(1234.56, { currency: 'EUR' });
    expect(result).toMatch(/€\s?1,234\.56|1,234\.56\s?€/);
  });

  it('supports compact notation', () => {
    const result = formatCurrency(1234567, { notation: 'compact' });
    expect(result).toMatch(/^\$\d+(\.\d+)?[MK]?$/);
  });

  it('respects overridden minimumFractionDigits', () => {
    const result = formatCurrency(12.3, { minimumFractionDigits: 0 });
    expect(result).toBe('$12.3');
  });
});
