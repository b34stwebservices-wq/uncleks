# 🔧 Troubleshooting Guide - Uncle K's

## Common Issues & Solutions

---

## 🔐 Authentication Issues

### "Firebase config not found"
**Cause**: `.env.local` file missing or incomplete
**Solution**:
```bash
# Copy the template
cp .env.example .env.local

# Add your Firebase credentials
# Get credentials from: Firebase Console → Project Settings → Your Apps
```

### "User not found" / "Wrong password"
**Cause**: Incorrect credentials or user doesn't exist
**Solution**:
- Verify email is correct (case-sensitive)
- Check password is correct
- Try registering a new account
- Check Firebase Console → Authentication → Users

### "Email already in use"
**Cause**: Email already registered
**Solution**:
- Use different email address
- Try password reset if you forgot password
- Check if email is in Firestore `users` collection

### Persistent login not working
**Cause**: localStorage disabled or auth context not initialized
**Solution**:
```javascript
// Check if localStorage is available
console.log(localStorage.getItem('test'));

// Clear and refresh
localStorage.clear();
location.reload();

// Check AuthContext is wrapping entire app
```

---

## 🛒 Cart & Checkout Issues

### Cart empties on page refresh
**Cause**: localStorage not persisting
**Solution**:
```javascript
// Check localStorage
console.log(localStorage.getItem('unclek_cart'));

// Clear and rebuild
localStorage.removeItem('unclek_cart');

// Check if private browsing mode is on
```

### "Checkout button not working"
**Cause**: Empty cart or form validation error
**Solution**:
- Add at least one item to cart
- Fill in all required fields
- Check browser console for errors
- Try in incognito mode

### Order total showing incorrectly
**Cause**: Calculation error or stale data
**Solution**:
```javascript
// Reset cart and recalculate
localStorage.removeItem('unclek_cart');
location.reload();

// Check CartContext getTotalPrice function
```

---

## 📷 Image Upload Issues

### "Image fails to upload"
**Cause**: Firebase Storage rules or file size issue
**Solution**:

1. Check Firebase Console → Cloud Storage → Rules:
```javascript
match /products/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth.token.admin == true;  // This must be true
}
```

2. Check file size (max 100MB per file)
3. Try PNG or JPG format
4. Check browser console for detailed error

### Images not displaying in products
**Cause**: Wrong image URL or storage path
**Solution**:
```javascript
// Check image URL in Firestore
// Should look like: https://storage.googleapis.com/...

// Verify file exists in Storage Console
// Check file permissions
```

### Image uploading but not showing
**Cause**: URL not saved correctly
**Solution**:
```javascript
// In ProductForm.jsx, verify getDownloadURL is awaited
const imageUrl = await getDownloadURL(storageRef);

// Check product data in Firestore Console
```

---

## 📦 Product Management Issues

### "Products not showing in store"
**Cause**: Empty collection or query error
**Solution**:
```javascript
// Add test products in Firebase Console
// Check Firestore → products collection exists
// Verify products have all required fields

// Check browser console for errors
// Try refreshing page
```

### "Can't edit product"
**Cause**: Not admin user or product doesn't exist
**Solution**:
- Verify user role is "admin" in Firestore `users` collection
- Check product ID is correct
- Verify Firestore rules allow write access

### "Delete product fails"
**Cause**: Firebase permissions or concurrent edits
**Solution**:
```javascript
// Check rules allow delete
// Verify user is admin
// Check if product is referenced by orders
// Try hard refresh
```

---

## 👥 User & Role Issues

### "Admin dashboard not accessible"
**Cause**: User role not set to "admin"
**Solution**:
1. Open Firebase Console
2. Go to Firestore → users collection
3. Find your user document
4. Update `role` field to "admin"

### "Role not updating after login"
**Cause**: AuthContext cache issue
**Solution**:
```javascript
// Clear localStorage
localStorage.clear();

// Sign out and sign back in
// Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
```

### "Can't register as admin"
**Cause**: Firebase rules restrict role assignment
**Solution**:
```javascript
// In AuthContext.jsx, verify admin creation is allowed
// Or manually set role in Firebase Console after registration

// Temporarily allow in rules:
match /users/{userId} {
  allow write: if true;  // Temporarily
}
```

---

## 🏪 Order Management Issues

### "Orders not appearing"
**Cause**: No orders created or query error
**Solution**:
```javascript
// Check Firestore → orders collection exists
// Verify orders have all required fields
// Check Firestore rules allow read access
```

### "Can't update order status"
**Cause**: Admin permissions or stale data
**Solution**:
- Verify user is admin
- Check Firestore rules allow update
- Try page refresh
- Check browser console for errors

### "Order totals wrong"
**Cause**: Quantity calculation error
**Solution**:
```javascript
// Verify item quantity is stored correctly
// Check cart calculation in CartContext
// Clear cart and recalculate

// In orders collection, items should have:
{
  id: string
  name: string
  price: number
  quantity: number  // This is critical
}
```

---

## 🎨 UI/Display Issues

### Elements not aligned on mobile
**Cause**: Missing responsive classes
**Solution**:
- Check Tailwind classes are applied: `grid-cols-1 sm:grid-cols-2`
- Test in browser DevTools mobile view (F12)
- Check viewport meta tag in index.html

### Navbar hamburger not working
**Cause**: State not updating or click handler missing
**Solution**:
```javascript
// Check onClick handler in Navbar.jsx
// Verify useState hook is working
// Clear browser cache
```

### Buttons too small on mobile
**Cause**: Missing padding or height classes
**Solution**:
```html
<!-- Good -->
<button className="px-4 py-3 ...">Button</button>

<!-- Bad -->
<button className="px-1 py-1 ...">Button</button>
```

---

## 🌐 Network & Performance

### "App loads slowly"
**Cause**: Large images, slow network, or many Firestore reads
**Solution**:
```javascript
// Optimize images (compress before upload)
// Add pagination for product lists
// Cache products in local state
// Use React.memo for expensive components
```

### "Timeout errors on slow network"
**Cause**: Firebase requests taking too long
**Solution**:
```javascript
// Add loading states
// Increase timeout values in Firestore
// Show loading spinner instead of blocking
```

### "Too many Firestore reads (billing concern)"
**Cause**: Excessive queries
**Solution**:
```javascript
// Cache data locally
// Use pagination
// Limit results with .limit()
// Combine queries when possible
```

---

## 🐛 Console Errors

### "Cannot find module"
**Cause**: Import path incorrect
**Solution**:
- Check file exists at path
- Verify correct capitalization
- Check file extension (.jsx, .js)
- Example: `import Navbar from '../components/Navbar.jsx'`

### "Firebase is not defined"
**Cause**: Firebase config not imported
**Solution**:
```javascript
// Add import at top of file
import { db, auth, storage } from '../config/firebase';
```

### "useAuth must be used within AuthProvider"
**Cause**: Hook used outside Auth context
**Solution**:
- Make sure AuthProvider wraps component tree in App.jsx
- Check component imports AuthProvider

### "useCart must be used within CartProvider"
**Cause**: Hook used outside Cart context
**Solution**:
- Make sure CartProvider wraps component tree in App.jsx
- Check component imports CartProvider

---

## 🔄 State Management Issues

### "State not updating after Firebase operation"
**Cause**: Asynchronous operation not awaited
**Solution**:
```javascript
// Wrong
const data = getDocs(query);

// Right
const snapshot = await getDocs(query);
```

### "Stale data in cart"
**Cause**: localStorage not syncing with state
**Solution**:
```javascript
// Force sync
localStorage.setItem('unclek_cart', JSON.stringify(items));

// Or clear and rebuild
localStorage.removeItem('unclek_cart');
window.location.reload();
```

---

## 🔒 Security Issues

### "Unauthorized Firebase operations"
**Cause**: Rules don't allow operation
**Solution**:
1. Check Firestore rules in Firebase Console
2. Verify user has correct role
3. Check collection path matches rules
4. Look at Firebase Console → Firestore → Rules

### "CORS errors"
**Cause**: Cross-origin request blocked
**Solution**:
- This is normal for Firebase
- Check you're using official Firebase SDK
- Clear browser cache
- Try in incognito mode

---

## 📱 Mobile-Specific Issues

### "Touch interactions not working"
**Cause**: Touch event not properly bound
**Solution**:
```javascript
// Use onClick instead of onMouseDown
<button onClick={handleClick}>Button</button>

// Add touch-manipulation class
<button className="touch-manipulation">Button</button>
```

### "Scrolling feels janky"
**Cause**: Heavy re-renders or large images
**Solution**:
- Optimize images
- Add React.memo
- Use useCallback for handlers
- Check Performance tab in DevTools

---

## 🚀 Deployment Issues

### "App works locally but not deployed"
**Cause**: Environment variables not set
**Solution**:
- Check hosting provider has all Firebase env vars
- Verify .env.local is in .gitignore
- Don't commit .env.local to git

### "404 errors on page refresh"
**Cause**: SPA routing not configured
**Solution**:
- Firebase: Update firebase.json rewrites
- Vercel: Automatic (no action needed)
- Netlify: Enable "Single Page App" setting

### "Images 404 on deployed site"
**Cause**: Wrong image URL or Storage rules
**Solution**:
- Check Cloud Storage rules allow public read
- Verify image URL format
- Test URL directly in browser

---

## 💡 Debug Mode

Enable detailed logging:
```javascript
// In App.jsx
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 App loaded');
    console.log('👤 Auth:', useAuth());
    console.log('🛒 Cart:', useCart());
  }
}, []);
```

---

## 📞 Getting Help

1. **Check browser console** (F12 → Console tab)
2. **Check Firebase Console** for errors
3. **Read error messages carefully** - they often tell you the fix
4. **Google the error** - usually someone has solved it
5. **Check docs** - React, Firebase, Tailwind all have great docs

---

## ✅ Verification Checklist

- [ ] Can register new account
- [ ] Can login with existing account
- [ ] Can add products (admin only)
- [ ] Can browse store (customer)
- [ ] Can add items to cart
- [ ] Can proceed to checkout
- [ ] Can place order
- [ ] Can view orders (admin)
- [ ] Images upload and display
- [ ] Mobile layout responsive
- [ ] No console errors
- [ ] Loading states appear

---

**Still stuck? You can:**
- Restart your dev server: `npm run dev`
- Clear everything: `npm install && rm -rf node_modules/.vite`
- Check Firebase Console for real-time errors
- Enable console logging to trace execution

You've got this! 💪 🌶️
