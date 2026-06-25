import { useState, useCallback, useEffect } from 'react';
import { CartContext } from './cartContext';

const loadSavedCart = () => {
  try {
    const savedCart = localStorage.getItem('unclek_cart');
    if (!savedCart) return [];

    return JSON.parse(savedCart);
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadSavedCart);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('unclek_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [items]);

  const addToCart = useCallback((product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
