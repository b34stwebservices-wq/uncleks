// Currency formatting utility
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMK',
    minimumFractionDigits: 2,
  }).format(price || 0);
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : date.toDate?.();
  if (!d) return '';
  
  return new Intl.DateTimeFormat('en-ZM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate price
export const validatePrice = (price) => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0;
};

// Generate order ID preview
export const getOrderPreview = (orderId) => {
  return orderId ? orderId.substring(0, 8).toUpperCase() : '#####';
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'processing':
      return 'bg-orange-100 text-orange-700';
    case 'pending':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Get status badge text
export const getStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Round to 2 decimal places
export const roundPrice = (price) => {
  return Math.round((price || 0) * 100) / 100;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// localStorage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
};

// API error handler
export const getErrorMessage = (error) => {
  const apiError = error?.error || error;
  const errorCode = apiError?.code;
  const errorMessage = apiError?.message || error?.message;
  const apiReason = apiError?.errors?.[0]?.message;

  if (typeof errorCode === 'string') {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with that email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/email-already-in-use':
        return 'Email already registered.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/invalid-credential':
        return 'The provided credentials are invalid.';
      default:
        return errorMessage || 'An error occurred. Please try again.';
    }
  }

  if (typeof errorCode === 'number' && errorMessage) {
    if (errorMessage === 'INVALID_LOGIN_CREDENTIALS') {
      return 'Incorrect email or password.';
    }

    return errorMessage;
  }

  if (typeof apiReason === 'string') {
    if (apiReason === 'INVALID_LOGIN_CREDENTIALS') {
      return 'Incorrect email or password.';
    }
    return apiReason;
  }

  if (typeof error?.message === 'string') {
    if (error.message === 'pending-approval') {
      return 'Your account is pending approval. Please wait for admin confirmation.';
    }
    return error.message;
  }
  return 'An unexpected error occurred.';
};
