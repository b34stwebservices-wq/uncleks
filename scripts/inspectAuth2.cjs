const { getAuth } = require('firebase-admin/auth');
const auth = getAuth();
console.log('auth methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(auth)).filter(k=>typeof auth[k]==='function'));
console.log('getUserByEmail exists on auth prototype:', typeof auth.getUserByEmail);
console.log('createUser exists on auth prototype:', typeof auth.createUser);
