const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // toEqual compares the returned object's fields; toBe only checks object identity.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});
