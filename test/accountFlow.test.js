import test from 'node:test';
import assert from 'node:assert/strict';
import { getPostLoginPath } from '../src/utils/accountFlow.js';

test('routes admins to the dashboard after login', () => {
  assert.equal(getPostLoginPath('admin'), '/dashboard');
});

test('routes customers and unknown roles to the store after login', () => {
  assert.equal(getPostLoginPath('customer'), '/store');
  assert.equal(getPostLoginPath('pending'), '/store');
  assert.equal(getPostLoginPath(undefined), '/store');
});
