# Uncle K's - Quick Reference Guide

## 🚀 Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Firebase CLI
```bash
firebase login       # Authenticate with Firebase
firebase deploy      # Deploy to Firebase Hosting
firebase emulators:start  # Run local emulators
```

---

## 🧭 Navigation Guide

### Public Routes
- `/login` - Sign in page
- `/register` - Create account

### Customer Routes (Protected)
- `/store` - Product listing (main shop)
- `/checkout` - Order placement

### Admin Routes (Protected + Admin Only)
- `/dashboard` - Overview with stats
- `/products` - Manage products
- `/products/new` - Create new product
- `/products/:id` - Edit product
- `/orders` - Manage orders

### Default Redirect
- `/` → `/store` (or `/login` if not authenticated)

---

## 💾 Local Storage

### Cart Data
```
Key: "unclek_cart"
Value: [
  {
    id: "product_id",
    name: "Product Name",
    price: 45.99,
    image: "image_url",
    quantity: 2
  }
]
```

Clear cart:
```javascript
localStorage.removeItem("unclek_cart");
```

---

## 🎯 Using Context Hooks

### AuthContext
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAdmin, login, logout, register } = useAuth();
  
  return (
    <>
      {user && <p>Hello {user.email}</p>}
      {isAdmin && <p>You're an admin</p>}
      <button onClick={logout}>Sign Out</button>
    </>
  );
}
```

### CartContext
```javascript
import { useCart } from '../context/CartContext';

function MyComponent() {
  const { items, addToCart, removeFromCart, getTotalPrice } = useCart();
  
  return (
    <>
      <p>Items: {items.length}</p>
      <p>Total: ZMK {getTotalPrice().toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add</button>
    </>
  );
}
```

---

## 🎨 Tailwind Utilities

### Mobile-First Responsive
```jsx
// Mobile: 1 column, Tablet: 2, Desktop: 3
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Mobile: full width button, Desktop: inline
<button className="w-full sm:w-auto">

// Hide on mobile, show on desktop
<div className="hidden md:block">

// Mobile spacing, desktop spacing
<div className="p-4 md:p-8">
```

### Brand Colors
```jsx
// Primary green
<div className="bg-primary-900 text-white">
<button className="btn-primary">  // Green button

// Accent red
<div className="text-accent-DEFAULT">
<span className="bg-accent-light">  // Orange background

// Neutral grays
<div className="bg-gray-50 text-gray-900">
```

### Custom Components
```jsx
// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>

// Cards
<div className="card p-6">Content</div>

// Icons
<button className="btn-icon">
  <Menu size={24} />
</button>
```

---

## 🔄 Common Patterns

### Adding a Product
```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadImage = async (file) => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

const addProduct = async (name, price, description, imageFile) => {
  const imageUrl = await uploadImage(imageFile);
  
  await addDoc(collection(db, 'products'), {
    name,
    price: parseFloat(price),
    description,
    image: imageUrl,
    createdAt: serverTimestamp()
  });
};
```

### Fetching Products
```javascript
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const getProducts = async () => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Creating an Order
```javascript
const createOrder = async (customerName, items, total) => {
  await addDoc(collection(db, 'orders'), {
    customer: customerName,
    items: items,
    total: total,
    status: 'pending',
    createdAt: serverTimestamp()
  });
};
```

### Updating Order Status
```javascript
const updateOrderStatus = async (orderId, newStatus) => {
  await updateDoc(doc(db, 'orders', orderId), {
    status: newStatus
  });
};
```

---

## 🛡️ Error Handling

### Try-Catch Pattern
```javascript
const [error, setError] = useState('');

const handleAction = async () => {
  setError('');
  try {
    // Your Firebase operation
    await operation();
  } catch (err) {
    setError(err.message || 'Something went wrong');
  }
};

return (
  <>
    <ErrorAlert message={error} onDismiss={() => setError('')} />
    <button onClick={handleAction}>Action</button>
  </>
);
```

---

## 📱 Mobile Testing Checklist

- [ ] Test all buttons are at least 44px tall
- [ ] Test spacing on small screens (320px)
- [ ] Test images load on mobile data
- [ ] Test form inputs are accessible
- [ ] Test hamburger menu works
- [ ] Test cart modal on mobile
- [ ] Test checkout flow
- [ ] Test back navigation
- [ ] No horizontal scrolling
- [ ] Touch targets properly spaced

---

## 🔐 Role-Based Access

### Admin Check
```javascript
import { useAuth } from '../context/AuthContext';

function AdminOnly() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) return <div>Access denied</div>;
  
  return <div>Admin content</div>;
}
```

### Protected Route
```javascript
import ProtectedRoute from '../routes/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 📊 Performance Tips

1. **Images**: Compress before upload
2. **Bundle**: Use code splitting for routes
3. **Firebase**: Use indexes for complex queries
4. **Caching**: Leverage browser cache for products
5. **Lazy Loading**: Load images on demand

---

## 🐛 Debugging Tips

### Check Auth State
```javascript
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  console.log('Current user:', user);
});
```

### Check Cart
```javascript
const cart = JSON.parse(localStorage.getItem('unclek_cart') || '[]');
console.log('Cart:', cart);
```

### Monitor Firestore
Open Firebase Console → Firestore → Your collection → See data in real-time

### React DevTools
Use React DevTools Chrome extension to inspect component state

---

## 📝 Code Examples - Complete Page

```jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';

export const MyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        // Fetch from Firebase
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ErrorAlert message={error} onDismiss={() => setError('')} />
      
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {data.map(item => (
            <div key={item.id} className="card p-6">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 🎉 You're Ready!

Follow the [SETUP_GUIDE.md](./SETUP_GUIDE.md) to get started.

Questions? Check the [README_UNCLEK.md](./README_UNCLEK.md)

---

**Built with ❤️ for Uncle K's** 🌶️
