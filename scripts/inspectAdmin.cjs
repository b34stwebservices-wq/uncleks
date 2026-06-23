const admin = require('firebase-admin');
console.log('firebase-admin keys:', Object.keys(admin));
console.log('has credential:', !!admin.credential);
console.log('has credential.cert:', admin.credential && typeof admin.credential.cert === 'function');
