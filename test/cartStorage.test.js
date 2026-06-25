import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCartItems, saveCartItems } from '../src/utils/cartStorage.js';

test('loads saved cart arrays from storage', () => {
  const cart = [{ id: 'hot-sauce', quantity: 2 }];
  const storage = {
    getItem: () => JSON.stringify(cart),
  };

  assert.deepEqual(loadCartItems(storage), cart);
});

test('falls back to an empty cart when storage is unavailable', () => {
  const storage = {
    getItem: () => {
      throw new Error('blocked');
    },
  };

  assert.deepEqual(loadCartItems(storage), []);
});

test('saves cart items and reports success', () => {
  const calls = [];
  const storage = {
    setItem: (key, value) => calls.push([key, value]),
  };

  assert.equal(saveCartItems([{ id: 'beans' }], storage), true);
  assert.deepEqual(calls, [['unclek_cart', '[{"id":"beans"}]']]);
});

test('reports failed saves without throwing', () => {
  const storage = {
    setItem: () => {
      throw new Error('quota exceeded');
    },
  };

  assert.equal(saveCartItems([{ id: 'beans' }], storage), false);
});
