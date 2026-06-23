# 🚀 Deployment Guide for Uncle K's

## Pre-Deployment Checklist

- [ ] Firebase credentials are configured in `.env.local`
- [ ] All pages are tested locally
- [ ] Error handling is in place
- [ ] Mobile responsiveness verified
- [ ] Security rules configured in Firebase Console
- [ ] Images are optimized
- [ ] Sensitive data removed from code

---

## 1. Firebase Hosting Deployment

### Setup
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to your Firebase account
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Choose:
# - Select your Firebase project
# - Public directory: dist
# - Single page app: Yes
```

### Build & Deploy
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

Your app will be live at: `https://your-project-id.firebaseapp.com`

---

## 2. Vercel Deployment

### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Configuration
Create a `vercel.json` file:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_FIREBASE_API_KEY": "@firebase_api_key",
    "VITE_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "VITE_FIREBASE_PROJECT_ID": "@firebase_project_id",
    "VITE_FIREBASE_STORAGE_BUCKET": "@firebase_storage_bucket",
    "VITE_FIREBASE_MESSAGING_SENDER_ID": "@firebase_messaging_sender_id",
    "VITE_FIREBASE_APP_ID": "@firebase_app_id"
  }
}
```

Set environment variables in Vercel Dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add each Firebase credential

---

## 3. Netlify Deployment

### Option A: Drag & Drop
```bash
npm run build
# Drag dist/ folder to Netlify
```

### Option B: Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables

---

## 4. Environment Variables Setup

In your hosting provider's dashboard, add:

```
VITE_FIREBASE_API_KEY = your_key
VITE_FIREBASE_AUTH_DOMAIN = your_domain
VITE_FIREBASE_PROJECT_ID = your_project_id
VITE_FIREBASE_STORAGE_BUCKET = your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
VITE_FIREBASE_APP_ID = your_app_id
```

---

## 5. Firebase Security Rules

### Firestore Rules (Set in Firebase Console)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - user can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Products - public read, admin write only
    match /products/{document=**} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth.token.admin == true;
    }
    
    // Orders - authenticated users can read/create, admins can manage
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
    
    // Product images - public read, admin write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

### Authentication Settings
1. Go to Firebase Console → Authentication
2. Enable Email/Password provider
3. Set password requirements (minimum 6 characters)
4. Optional: Enable additional providers (Google, Facebook, etc.)

---

## 6. Performance Optimization

### Frontend
```javascript
// Code splitting for routes
const Dashboard = lazy(() => import('./pages/AdminDashboard'));
const Storefront = lazy(() => import('./pages/Storefront'));

// Lazy load images
<img loading="lazy" src={url} />

// Optimize bundle
npm run build  # Check output size
```

### Firebase
- Enable Cloud Firestore indexes for common queries
- Set up Cloud Storage lifecycle rules to delete old images
- Use Firebase Caching headers

### SEO
Update `index.html` meta tags:
```html
<meta name="description" content="Uncle K's - Bold Flavor from Zambia">
<meta property="og:title" content="Uncle K's - Bold Flavor from Zambia">
<meta property="og:image" content="https://your-domain.com/og-image.png">
```

---

## 7. Monitoring & Maintenance

### Firebase Console Monitoring
- Analytics: Track user behavior
- Crashes: Monitor app crashes
- Performance: Check load times

### Error Tracking
```javascript
// In your components
import { getErrorMessage } from '../utils/helpers';

try {
  // Firebase operation
} catch (error) {
  console.error('Error:', getErrorMessage(error));
  // Log to error tracking service (Sentry, LogRocket, etc.)
}
```

### Backup Strategy
- Set up automatic Firestore backups in Google Cloud Console
- Export collections periodically
- Monitor Cloud Storage usage

---

## 8. SSL/HTTPS

All Firebase Hosting and Vercel deployments come with **automatic SSL certificates**.

For custom domains:
1. Go to hosting provider dashboard
2. Add custom domain
3. Follow DNS configuration steps
4. SSL certificate auto-issued

---

## 9. Domain Configuration

### Firebase Hosting
```bash
firebase hosting:channel:deploy staging
firebase open hosting:channel
```

### Custom Domain
1. Firebase Console → Hosting
2. Click "Connect domain"
3. Update DNS records with your provider
4. Wait for verification (typically 24 hours)

---

## 10. Database Scaling

### When you need more features:

**Pagination (products/orders)**
```javascript
import { query, limit, startAfter, getDocs } from 'firebase/firestore';

const pageSize = 20;
let lastVisible = null;

const getNextPage = async () => {
  const q = query(
    collection(db, 'products'),
    orderBy('createdAt', 'desc'),
    startAfter(lastVisible),
    limit(pageSize)
  );
  const snapshot = await getDocs(q);
  lastVisible = snapshot.docs[snapshot.docs.length - 1];
  return snapshot.docs;
};
```

**Search (products by name)**
For production, use:
- Firebase Text Search extension
- Algolia (recommended for e-commerce)
- Elasticsearch

---

## 11. Common Deployment Issues

### Issue: "Environment variables not found"
**Solution**: Make sure variables are set in hosting provider, not just locally

### Issue: "Firebase initialization error"
**Solution**: Check .env.local is not committed; verify credentials in console

### Issue: "Image uploads fail"
**Solution**: Check Cloud Storage rules allow write access for authenticated users

### Issue: "404 errors on page refresh"
**Solution**: Configure single-page app routing in your hosting provider

**Firebase:**
```json
{
  "rewrites": [
    {
      "source": "**",
      "destination": "/index.html"
    }
  ]
}
```

**Vercel:** Automatically handles SPA routing

**Netlify:** Enable "Single Page App" in build settings

---

## 12. Rollback Strategy

### Keep previous versions
```bash
# Firebase
firebase hosting:channel:list
firebase hosting:clone source-site target-site

# Vercel
vercel rollback

# Netlify
Deploy history available in dashboard
```

---

## 13. Analytics & Tracking

### Google Analytics
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Firebase Analytics
```javascript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Track product view
logEvent(analytics, 'view_product', {
  product_id: product.id,
  product_name: product.name,
  price: product.price
});

// Track checkout
logEvent(analytics, 'checkout', {
  total: cartTotal
});
```

---

## 14. Post-Launch Checklist

- [ ] Monitor error rates
- [ ] Check Core Web Vitals
- [ ] Test on various devices
- [ ] Monitor Firebase costs
- [ ] Set up automated backups
- [ ] Enable logging/monitoring
- [ ] Set admin password recovery
- [ ] Verify HTTPS everywhere
- [ ] Test on slow networks
- [ ] Social media links working
- [ ] Contact form configured
- [ ] Analytics tracking verified

---

## Support & Resources

- [Firebase Deployment Docs](https://firebase.google.com/docs/hosting)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com)
- [Performance Best Practices](https://web.dev/performance/)

---

**Ready to launch Uncle K's? You've got this! 🚀** 🌶️
