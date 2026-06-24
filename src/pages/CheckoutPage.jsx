import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ErrorAlert } from '../components/ErrorAlert';
import { SuccessAlert } from '../components/SuccessAlert';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const totalPrice = getTotalPrice();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        customer: customerName,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        total: totalPrice,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);

      setSuccessMsg('Order placed successfully!');
      clearCart();

      setTimeout(() => {
        navigate('/store');
      }, 2000);
    } catch (error) {
      setErrorMsg('Failed to place order. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to store if cart is empty and not in success state
  if (items.length === 0 && !successMsg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/store')}
            className="btn-primary inline-block"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <SuccessAlert message={successMsg} onDismiss={() => setSuccessMsg('')} />
      <ErrorAlert message={errorMsg} onDismiss={() => setErrorMsg('')} />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto pb-8">
        {/* Header */}
        <button
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 text-primary-900 hover:text-primary-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Store
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ZMK {(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}

              {/* Total */}
              <div className="pt-3 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-accent">
                  ZMK {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                  required
                />
              </div>

              {/* Info Message */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Note:</strong> Payment and delivery details will be added soon.
                  For now, your order is confirmed with "Pending" status.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => navigate('/store')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
