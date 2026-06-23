import fs from 'fs/promises';
import path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

async function loadServiceAccount(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Could not read service account file at ${filePath}: ${err.message}`);
  }
}

const sampleProducts = [
  {
    id: 'nkubama-vegetable-soup',
    name: 'Nkubama Vegetable Soup',
    price: 45.0,
    description: 'A rich, comforting vegetable soup made with fresh local greens and traditional spices.',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'chikanda-spice-mix',
    name: 'Chikanda Spice Mix',
    price: 28.0,
    description: 'Authentic Zambian spice blend for making chikanda and savory stews.',
    image:
      'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cassava-flour',
    name: 'Cassava Flour',
    price: 32.5,
    description: 'Finely milled cassava flour for thick porridge, baking, and traditional dishes.',
    image:
      'https://images.unsplash.com/photo-1582452361407-eca4e1c0d5b6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mealie-meal-pack',
    name: 'Premium Mealie Meal',
    price: 19.99,
    description: 'High-quality mealie meal made from freshly ground maize for nshima and more.',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ntetu-cooking-oil',
    name: 'Ntetu Cooking Oil',
    price: 25.0,
    description: 'Pure cooking oil with a smooth taste ideal for frying, sautéing, and baking.',
    image:
      'https://images.unsplash.com/photo-1529270290299-8e6c4f71a8f4?auto=format&fit=crop&w=900&q=80',
  },
];

const sampleOrders = [
  {
    id: 'sample-order-1',
    customer: 'Grace Mwale',
    status: 'pending',
    items: [
      { id: 'nkubama-vegetable-soup', name: 'Nkubama Vegetable Soup', price: 45.0, quantity: 1 },
      { id: 'cassava-flour', name: 'Cassava Flour', price: 32.5, quantity: 2 },
    ],
  },
  {
    id: 'sample-order-2',
    customer: 'Tendai Banda',
    status: 'processing',
    items: [
      { id: 'mealie-meal-pack', name: 'Premium Mealie Meal', price: 19.99, quantity: 3 },
      { id: 'chikanda-spice-mix', name: 'Chikanda Spice Mix', price: 28.0, quantity: 1 },
    ],
  },
];

function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

async function seedProducts(db, Timestamp) {
  const batch = db.batch();
  sampleProducts.forEach((product) => {
    const ref = db.collection('products').doc(product.id);
    batch.set(ref, {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });
  await batch.commit();
  console.log(`Seeded ${sampleProducts.length} products.`);
}

async function seedOrders(db, Timestamp) {
  const batch = db.batch();
  sampleOrders.forEach((order) => {
    const ref = db.collection('orders').doc(order.id);
    batch.set(ref, {
      customer: order.customer,
      status: order.status,
      items: order.items,
      total: Number(calculateTotal(order.items).toFixed(2)),
      createdAt: Timestamp.now(),
    });
  });
  await batch.commit();
  console.log(`Seeded ${sampleOrders.length} orders.`);
}

async function ensureDemoUsers(admin, db, Timestamp) {
  const demoUsers = [
    { email: 'admin@unclek.com', password: 'admin123', role: 'admin' },
    { email: 'customer@unclek.com', password: 'customer123', role: 'customer' },
  ];

  for (const u of demoUsers) {
    try {
      // Use modular admin auth
      const adminAuthModule = await import('firebase-admin/auth');
      const { getAuth } = adminAuthModule;
      const auth = getAuth();

      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(u.email);
        console.log(`User already exists: ${u.email}`);
      } catch (err) {
        // Create user if not found
        userRecord = await auth.createUser({
          email: u.email,
          password: u.password,
          emailVerified: false,
        });
        console.log(`Created user: ${u.email}`);
      }

      // Ensure Firestore user document exists with role
      const userDocRef = db.collection('users').doc(userRecord.uid);
      await userDocRef.set({
        email: u.email,
        role: u.role,
        createdAt: Timestamp.now(),
      }, { merge: true });
      console.log(`Ensured Firestore user doc for ${u.email}`);
    } catch (err) {
      console.error(`Failed to ensure user ${u.email}:`, err.message || err);
    }
  }
}

async function main() {
  const serviceAccount = await loadServiceAccount(serviceAccountPath);
  // Dynamic import to handle ESM/CJS interop
  // Use the modular admin SDK imports (app + firestore)
  const adminApp = await import('firebase-admin/app');
  const adminFirestore = await import('firebase-admin/firestore');

  const { initializeApp, cert } = adminApp;
  const { getFirestore, Timestamp } = adminFirestore;

  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();

  // Also ensure demo users exist
  // Use createRequire to access firebase-admin auth helpers reliably
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const adminRoot = require('firebase-admin');

  console.log('Seeding Firestore using Admin SDK (modular)...');
  await ensureDemoUsers(adminRoot, db, Timestamp);
  await seedProducts(db, Timestamp);
  await seedOrders(db, Timestamp);
  console.log('✅ Admin seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Admin seed failed:', err.message || err);
  process.exit(1);
});
