import test from 'node:test';
import assert from 'node:assert/strict';
import { parseProductPrice } from '../src/utils/productValidation.js';

test('accepts positive numeric prices', () => {
  assert.equal(parseProductPrice('12.50'), 12.5);
  assert.equal(parseProductPrice(9), 9);
});

test('rejects empty, zero, negative, and non-numeric prices', () => {
  assert.equal(parseProductPrice(''), null);
  assert.equal(parseProductPrice('0'), null);
  assert.equal(parseProductPrice('-4'), null);
  assert.equal(parseProductPrice('abc'), null);
});
