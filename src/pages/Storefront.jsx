import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import ErrorAlert from '../components/ErrorAlert';

export const Storefront = ({ onShowCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productsSnap = await getDocs(productsQuery);
      const productsData = productsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCart={true} onCartClick={onShowCart} />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <ErrorAlert message={error} onDismiss={() => setError('')} />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900">🌶️ Uncle K's Store</h1>
          <p className="text-gray-600 mt-1">Bold flavor from Zambia. Fresh, premium products.</p>
        </div>

        {/* Products Grid - Mobile First */}
        {products.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="card overflow-hidden flex flex-col h-full hover:shadow-lg transition"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <p className="text-2xl font-bold text-accent mb-3">
                      ZMK {product.price?.toFixed(2) || '0.00'}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        });
                      }}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Storefront;
