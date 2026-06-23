# Uncle K's - Mobile-First E-Commerce & Admin System

A production-ready full-stack e-commerce and admin system for Uncle K's, a Zambian food brand selling hot sauces, spices, herbs, seasonings, and ready-to-eat products.

## 🎯 Features

### Admin Dashboard
- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: View, filter, and manage customer orders
- **Dashboard Overview**: Sales stats, recent orders, and quick actions
- Mobile-first responsive design

### Customer Storefront
- **Product Browse**: Beautiful product grid with images and descriptions
- **Shopping Cart**: Add/remove items with quantity control
- **Checkout**: Simple order placement with customer information
- Mobile-optimized shopping experience

### Authentication
- Email/password authentication with Firebase
- User roles (Admin/Customer)
- Persistent login sessions
- Protected routes for admin pages

## 🏗️ Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: TailwindCSS with mobile-first design
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Firebase project (free tier works)

### 1. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage
3. Copy your Firebase config

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Firebase credentials in `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 Mobile-First Design Principles

- **All layouts start with mobile** (single column, vertical stacking)
- **Responsive classes**: `sm:`, `md:`, `lg:` for scaling up
- **Touch-friendly**: Large buttons, proper spacing for mobile interaction
- **Performance**: Optimized for slow mobile networks

## 🎨 Brand Colors

- **Primary Green**: `#1B5E20` (brand identity, trust)
- **Accent Red**: `#E53935` (spice, heat, urgency)
- **Accent Orange**: `#FF6F00` (warmth, energy)
- **Black**: `#000000` (text, contrast)
- **White**: `#FFFFFF` (background, cleanliness)

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (routes)
├── context/         # Context providers (Auth, Cart)
├── routes/          # Route protection logic
├── config/          # Firebase configuration
├── services/        # Business logic (if needed)
└── assets/          # Images, SVGs
```

## 🗄️ Firestore Collections

### `users`
```
{
  email: string
  role: "admin" | "customer"
  createdAt: timestamp
}
```

### `products`
```
{
  name: string
  price: number
  description: string
  image: string (URL)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### `orders`
```
{
  customer: string
  items: [
    {
      id: string
      name: string
      price: number
      quantity: number
    }
  ]
  total: number
  status: "pending" | "processing" | "completed"
  createdAt: timestamp
}
```

## 🔐 Demo Accounts

For testing purposes:

**Admin Account:**
- Email: `admin@unclek.com`
- Password: `admin123`

**Customer Account:**
- Email: `customer@unclek.com`
- Password: `customer123`

*Note: Create these in Firebase Console manually, or they'll be auto-created on first registration.*

## 🚢 Build for Production

```bash
npm run build
```

Output files will be in the `dist/` directory.

## 📋 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Delivery tracking
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Push notifications

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📝 License

This project is proprietary to Uncle K's.

## 🆘 Support

For issues or questions:
1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Tailwind CSS Docs](https://tailwindcss.com/docs)
3. Check [React Router Documentation](https://reactrouter.com/)

---

**Made with ❤️ for Uncle K's - Bold Flavor from Zambia**
