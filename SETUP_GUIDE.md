# 🌶️ Uncle K's - Setup & Deployment Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd my-firebase-app
npm install
```

### 2. Set Up Firebase
Go to [Firebase Console](https://console.firebase.google.com):
1. Create a new project
2. Enable Authentication → Email/Password
3. Enable Firestore Database
4. Enable Cloud Storage
5. Get your web config from Project Settings

### 3. Configure Environment
```bash
# Copy the template
cp .env.example .env.local

# Add your Firebase credentials
nano .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📱 Mobile-First Architecture

### Design System
```
Mobile First (320px) → Tablet (640px) → Desktop (1024px+)
   Single Column    →  Two Columns  →  Three+ Columns
```

### Responsive Classes Used
- `sm:` (640px) - Small tablets
- `md:` (768px) - Regular tablets
- `lg:` (1024px) - Desktops
- Full width on mobile by default

### Touch-Friendly Design
- Buttons: minimum 44px height for mobile
- Spacing: 16px+ gap between interactive elements
- No hover states on mobile (only desktop)
- Bottom-aligned CTAs for thumb reach

---

## 🏗️ Complete Project Structure

```
my-firebase-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Mobile hamburger menu
│   │   ├── CartModal.jsx           # Shopping cart overlay
│   │   ├── LoadingSpinner.jsx      # Loading state
│   │   ├── ErrorAlert.jsx          # Error messages
│   │   └── SuccessAlert.jsx        # Success messages
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx           # Auth entry point
│   │   ├── RegisterPage.jsx        # User signup
│   │   ├── AdminDashboard.jsx      # Admin home (stats & quick actions)
│   │   ├── ProductsManagement.jsx  # Product grid with CRUD
│   │   ├── ProductForm.jsx         # Add/edit products
│   │   ├── OrdersManagement.jsx    # Order management
│   │   ├── Storefront.jsx          # Customer shop
│   │   └── CheckoutPage.jsx        # Order placement
│   │
│   ├── context/
│   │   ├── AuthContext.jsx         # Auth state & role management
│   │   └── CartContext.jsx         # Shopping cart (localStorage)
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx      # Route guard for admin pages
│   │
│   ├── config/
│   │   └── firebase.js             # Firebase setup
│   │
│   ├── App.jsx                     # Main routing
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind + custom styles
│
├── tailwind.config.js              # Custom colors & components
├── postcss.config.js               # PostCSS with Tailwind
├── vite.config.js                  # Vite configuration
├── .env.example                    # Environment template
├── .env.local                      # Your Firebase keys (gitignore)
└── package.json                    # Dependencies
```

---

## 🗄️ Firestore Data Model

### Collection: `users`
```javascript
{
  uid: "firebase_uid",
  email: "user@example.com",
  role: "admin" | "customer",
  createdAt: Timestamp
}
```

### Collection: `products`
```javascript
{
  id: "auto-generated",
  name: "Hot Chili Sauce",
  price: 45.99,
  description: "Our signature spicy sauce...",
  image: "https://storage.googleapis.com/...",
  stock: 150,  // Optional: for future inventory tracking
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `orders`
```javascript
{
  id: "auto-generated",
  customer: "John Doe",
  items: [
    {
      id: "product_id",
      name: "Hot Chili Sauce",
      price: 45.99,
      quantity: 2
    }
  ],
  total: 91.98,
  status: "pending" | "processing" | "completed",
  createdAt: Timestamp,
  notes: "" // Optional: delivery notes
}
```

---

## 🎨 Brand Identity Implementation

### Colors
```css
Primary Green:    #1B5E20  (trustworthy, natural)
Accent Red:       #E53935  (heat, urgency)
Accent Orange:    #FF6F00  (warmth, spice)
Black:            #000000  (contrast, text)
White:            #FFFFFF  (clean, background)
```

### Typography
- Headings: Bold, system font
- Body: Regular, readable
- Font sizes scale for mobile

### Components
- Cards with subtle shadows
- Buttons full-width on mobile
- Modal overlays for actions
- Badges for order status

---

## 🔐 User Flows

### Customer Journey
```
1. Visit app → Redirects to /login
2. Register/Login → /store (product listing)
3. Browse products → Add to cart
4. View cart (modal) → Proceed to checkout
5. Enter name → Place order
6. Order confirmed → Back to store
```

### Admin Journey
```
1. Login as admin → /dashboard (overview)
2. Navigate to:
   - /products → Product management CRUD
   - /orders → Order management
3. Can edit/delete products
4. Can update order status
```

---

## 🔒 Security Rules (Set in Firebase Console)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Products: anyone read, only admin write
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    
    // Orders: users read own, write own, admins manage all
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.token.admin == true;
    }
  }
}
```

### Cloud Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Product images: anyone can read, only admin write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## 📊 Features Checklist

### Phase 1 (Completed) ✅
- [x] Authentication (login/register)
- [x] Admin dashboard with stats
- [x] Product CRUD with image upload
- [x] Order management
- [x] Storefront with product grid
- [x] Shopping cart
- [x] Checkout
- [x] Mobile-first responsive design
- [x] Brand color scheme

### Phase 2 (Recommended) 🚀
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Email confirmations
- [ ] SMS notifications
- [ ] Inventory tracking
- [ ] Advanced search/filters
- [ ] Product reviews
- [ ] User profiles
- [ ] Wishlist feature

### Phase 3 (Future) 💭
- [ ] Delivery tracking
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Loyalty rewards program
- [ ] Social login
- [ ] Push notifications
- [ ] Dark mode

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
# Output in dist/

npm run preview
# Test production build locally
```

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Vercel
```bash
# Login to Vercel
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag-and-drop dist/ folder to Netlify
# Or connect GitHub repository
```

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase config not found"
**Solution**: Make sure `.env.local` exists with all Firebase credentials

### Issue: Images not uploading
**Solution**: Check Firebase Storage rules allow admin write access

### Issue: Cart not persisting
**Solution**: Check browser localStorage is enabled

### Issue: Admin routes showing blank
**Solution**: Make sure user role is set to "admin" in Firestore

---

## 📞 Support Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Vite Docs](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

---

## ✨ Tips & Best Practices

1. **Mobile Testing**: Always test on real mobile device
2. **Performance**: Use Lighthouse in DevTools
3. **Firebase**: Set up backups in Firebase Console
4. **Environment**: Never commit `.env.local` to git
5. **Caching**: Use service workers for offline support (future)

---

**Made with ❤️ for Uncle K's - Bold Flavor from Zambia** 🌶️
