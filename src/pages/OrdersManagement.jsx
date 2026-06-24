import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { TrendingDown, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SuccessAlert } from '../components/SuccessAlert';
import { ErrorAlert } from '../components/ErrorAlert';

export const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnap = await getDocs(ordersQuery);
      const ordersData = ordersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      setErrorMsg('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
    };

    loadOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
      });
      setSuccessMsg('Order status updated');
      fetchOrders();
    } catch (error) {
      setErrorMsg('Failed to update order');
      console.error(error);
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === 'all' || order.status === filter
  );

  if (loading) return <LoadingSpinner />;

  const statusBadgeClass = (status) => {
    if (status === 'completed')
      return 'bg-green-100 text-green-700';
    if (status === 'processing')
      return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <SuccessAlert message={successMsg} onDismiss={() => setSuccessMsg('')} />
      <ErrorAlert message={errorMsg} onDismiss={() => setErrorMsg('')} />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'processing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-primary-900 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List - Mobile First */}
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card p-4 sm:p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.customer} • {order.items?.length || 0} items
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${statusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} × {item.quantity || 1}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ZMK {(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-accent">
                      ZMK {order.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {order.status !== 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      className="flex-1 btn-secondary bg-orange-100 text-orange-700 hover:bg-orange-200 flex items-center justify-center gap-2"
                    >
                      <TrendingDown size={18} />
                      Mark Processing
                    </button>
                  )}
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 btn-secondary bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
