import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrdersForUser } from '../services/orderService';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';

const statusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setError('');
        setLoading(true);
        const userOrders = await getOrdersForUser(user.uid);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Unable to load your orders right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCart={true} onCartClick={() => navigate('/store')} />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            Track your order status and review your past purchases.
          </p>
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        {orders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600 mb-4">You have no orders yet.</p>
            <button
              onClick={() => navigate('/store')}
              className="btn-primary"
            >
              Browse the store
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="card p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed</p>
                    <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusBadgeClass(order.status)}`}>
                    {order.status || 'pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-medium text-gray-900">{order.items?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-accent">ZMK {order.total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Shipping address</p>
                    <p className="mt-2 text-gray-900">
                      {order.address}, {order.city}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{order.phone}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Ordered items</p>
                    <ul className="mt-2 space-y-2 text-gray-900">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-sm">
                          <span>{item.name} x {item.quantity || 1}</span>
                          <span className="font-semibold">ZMK {(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
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

export default OrderHistory;
