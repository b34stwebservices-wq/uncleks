import fs from 'fs/promises';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

const envPath = path.resolve(process.cwd(), '.env.local');

async function loadEnv(filePath) {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    return contents
      .split(/\r?\n/)
      .filter((line) => line && !line.trim().startsWith('#'))
      .reduce((acc, line) => {
        const [key, ...rest] = line.split('=');
        acc[key.trim()] = rest.join('=').trim();
        return acc;
      }, {});
  } catch (error) {
    return {};
  }
}

function getFirebaseConfig(env) {
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID || env.FIREBASE_APP_ID,
  };
}

async function ensureConfig(config) {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase config values: ${missing.join(', ')}. Please update .env.local or export environment variables.`
    );
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

async function seedProducts(db) {
  const tasks = sampleProducts.map((product) => {
    const productData = {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    return setDoc(doc(db, 'products', product.id), productData);
  });

  await Promise.all(tasks);
  console.log(`Seeded ${sampleProducts.length} products.`);
}

async function seedOrders(db) {
  const tasks = sampleOrders.map((order) => {
    const orderData = {
      customer: order.customer,
      status: order.status,
      items: order.items,
      total: Number(calculateTotal(order.items).toFixed(2)),
      createdAt: Timestamp.now(),
    };
    return setDoc(doc(db, 'orders', order.id), orderData);
  });

  await Promise.all(tasks);
  console.log(`Seeded ${sampleOrders.length} orders.`);
}

async function main() {
  const env = await loadEnv(envPath);
  const firebaseConfig = getFirebaseConfig(env);

  await ensureConfig(firebaseConfig);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('Seeding Firebase Firestore with sample data...');
  await seedProducts(db);
  await seedOrders(db);
  console.log('✅ Seed complete. Refresh your app to see new products and orders.');
}

main().catch((error) => {
  console.error('Seeding failed:', error.message || error);
  process.exit(1);
});
