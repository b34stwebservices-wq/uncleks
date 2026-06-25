const CART_KEY = 'unclek_cart';

export const loadCartItems = (storage = localStorage) => {
  try {
    const savedCart = storage.getItem(CART_KEY);
    if (!savedCart) return [];

    const parsedCart = JSON.parse(savedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

export const saveCartItems = (items, storage = localStorage) => {
  try {
    storage.setItem(CART_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    return false;
  }
};
