const firestore = require('firebase-admin/firestore');
console.log('firestore keys:', Object.keys(firestore));
console.log('Timestamp exists:', !!firestore.Timestamp);
console.log('FieldValue exists:', !!firestore.FieldValue);
console.log('getFirestore exists:', !!firestore.getFirestore);
