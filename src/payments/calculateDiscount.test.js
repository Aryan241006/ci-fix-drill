const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  expect(calculateDiscount(100, 0)).toBe(100); // This passes
});

test('applies 10 percent discount correctly', () => {
  // A 10% discount on 100 returns 90, so the expected value was incorrect.
  expect(calculateDiscount(100, 10)).toBe(90);
});
