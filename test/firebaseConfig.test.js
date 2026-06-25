import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertFirebaseConfig,
  getFirebaseConfig,
  getMissingFirebaseEnv,
} from '../src/config/firebaseConfig.js';

const validEnv = {
  VITE_FIREBASE_API_KEY: 'api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'app.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'project-id',
  VITE_FIREBASE_STORAGE_BUCKET: 'bucket.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: 'sender-id',
  VITE_FIREBASE_APP_ID: 'app-id',
};

test('builds Firebase config from Vite env values', () => {
  assert.deepEqual(getFirebaseConfig(validEnv), {
    apiKey: 'api-key',
    authDomain: 'app.firebaseapp.com',
    projectId: 'project-id',
    storageBucket: 'bucket.appspot.com',
    messagingSenderId: 'sender-id',
    appId: 'app-id',
  });
});

test('returns missing Firebase env variable names', () => {
  assert.deepEqual(getMissingFirebaseEnv({ ...validEnv, VITE_FIREBASE_APP_ID: '' }), [
    'VITE_FIREBASE_APP_ID',
  ]);
});

test('throws a clear error when Firebase env is incomplete', () => {
  assert.throws(
    () => assertFirebaseConfig({ ...validEnv, VITE_FIREBASE_PROJECT_ID: undefined }),
    /Missing Firebase environment variables: VITE_FIREBASE_PROJECT_ID/
  );
});
