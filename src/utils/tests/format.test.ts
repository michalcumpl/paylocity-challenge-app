import { formatNumber, formatCurrency } from "../format";

describe("formatNumber", () => {
  it("formats plain numbers with up to 2 decimals", () => {
    expect(formatNumber(1234.56)).toBe("1,234.56");
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000.789)).toBe("1,000.79"); // rounds properly
  });

  it("respects custom decimal settings", () => {
    const result = formatNumber(12.3456, { maximumFractionDigits: 1 });
    expect(result).toBe("12.3");
  });

  it("handles large and small numbers", () => {
    expect(formatNumber(987654321)).toBe("987,654,321");
    expect(formatNumber(0.4567)).toBe("0.46");
  });

  it("respects minimumFractionDigits", () => {
    const result = formatNumber(12, { minimumFractionDigits: 2 });
    expect(result).toBe("12.00");
  });
});

describe("formatCurrency", () => {
  it("formats USD currency with no forced decimals", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
    expect(formatCurrency(1000)).toBe("$1,000");
  });

  it("handles zero and negative values", () => {
    expect(formatCurrency(0)).toBe("$0");
    expect(formatCurrency(-1234.5)).toBe("-$1,234.5");
  });

  it("supports compact notation", () => {
    const result = formatCurrency(1234567, { notation: "compact" });
    expect(result).toMatch(/^\$\d+(\.\d+)?[MK]?$/);
  });

  it("accepts custom currency", () => {
    const result = formatCurrency(1234.56, { currency: "EUR" });
    // Locale may vary, so test pattern rather than exact string
    expect(result).toMatch(/€\s?1,234(\.|,)?56|1,234(\.|,)?56\s?€/);
  });

  it("respects custom fraction options", () => {
    const result = formatCurrency(12.345, { maximumFractionDigits: 1 });
    expect(result).toBe("$12.3");
  });
});
