import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ErrorAlert } from '../components/ErrorAlert';
import { SuccessAlert } from '../components/SuccessAlert';
import { createOrder } from '../services/orderService';
import { logAuditEvent } from '../services/auditService';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState(() => user?.displayName || user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState(null);
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

    if (!address.trim()) {
      setErrorMsg('Please enter your address');
      return;
    }

    if (!city.trim()) {
      setErrorMsg('Please enter your city or town');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: user?.uid || null,
        userEmail: user?.email || '',
        customer: customerName,
        address,
        city,
        phone,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        total: totalPrice,
        status: 'pending',
        createdAt: new Date(),
      };

      const createdOrderId = await createOrder(orderData);
      try {
        await logAuditEvent({
          actorId: user?.uid,
          actorEmail: user?.email,
          actionType: 'order.created',
          entityType: 'order',
          entityId: createdOrderId,
          entityName: `Order ${createdOrderId.slice(0, 8)}`,
          details: `Customer ${customerName} created an order for ZMK ${totalPrice.toFixed(2)}.`,
        });
      } catch (auditError) {
        console.error('Failed to log audit event:', auditError);
      }

      setOrderId(createdOrderId);
      setSuccessMsg('Order placed successfully!');
      clearCart();
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to place order. Please try again.');
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

  if (items.length === 0 && successMsg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-12 max-w-2xl mx-auto text-center">
          <SuccessAlert message={successMsg} onDismiss={() => setSuccessMsg('')} />
          <div className="card p-8 rounded-3xl shadow-sm border border-gray-200 mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank you for your order</h1>
            <p className="text-gray-600 mb-2">
              Your order {orderId ? `#${orderId.slice(0, 8)}` : ''} is pending confirmation.
            </p>
            <p className="text-gray-600 mb-6">
              We’ll update your order status soon. You can view your orders anytime from your order history.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate('/my-orders')}
                className="btn-primary w-full sm:w-auto"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/store')}
                className="btn-secondary w-full sm:w-auto"
              >
                Continue Shopping
              </button>
            </div>
          </div>
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

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City / Town *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lusaka"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+260 97 123 4567"
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
