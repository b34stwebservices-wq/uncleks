const auth = require('firebase-admin/auth');
console.log('auth keys:', Object.keys(auth));
console.log('getAuth exists:', !!auth.getAuth);
console.log('getUserByEmail exists:', !!auth.getUserByEmail);
console.log('createUser exists:', !!auth.createUser);
