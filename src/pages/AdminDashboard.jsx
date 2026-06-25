import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { BarChart3, Package, ShoppingBag, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products count
        const productsQuery = query(collection(db, 'products'));
        const productsSnap = await getDocs(productsQuery);
        const productsCount = productsSnap.size;

        // Fetch orders
        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const ordersSnap = await getDocs(ordersQuery);
        const ordersCount = ordersSnap.size;

        // Fetch users count
        const usersQuery = query(collection(db, 'users'));
        const usersSnap = await getDocs(usersQuery);
        const usersCount = usersSnap.size;

        // Calculate total revenue
        let totalRevenue = 0;
        const ordersData = [];
        ordersSnap.forEach((doc) => {
          const order = doc.data();
          totalRevenue += order.total || 0;
          ordersData.push({ id: doc.id, ...order });
        });

        setStats({
          products: productsCount,
          orders: ordersCount,
          users: usersCount,
          totalRevenue: totalRevenue.toFixed(2),
        });

        setRecentOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Uncle K's Admin Panel</p>
        </div>

        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {/* Products Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-primary-900 mt-2">{stats.products}</p>
              </div>
              <Package className="text-primary-900 w-8 h-8 opacity-20" />
            </div>
            <Link
              to="/products"
              className="text-primary-900 text-sm font-semibold hover:underline mt-4 inline-block"
            >
              Manage Products →
            </Link>
          </div>

          {/* Orders Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-accent mt-2">{stats.orders}</p>
              </div>
              <ShoppingBag className="text-accent w-8 h-8 opacity-20" />
            </div>
            <Link
              to="/orders"
              className="text-accent text-sm font-semibold hover:underline mt-4 inline-block"
            >
              View Orders →
            </Link>
          </div>

          {/* Users Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">User Records</p>
                <p className="text-3xl font-bold text-primary-900 mt-2">{stats.users}</p>
              </div>
              <Users className="text-primary-900 w-8 h-8 opacity-20" />
            </div>
            <Link
              to="/users"
              className="text-primary-900 text-sm font-semibold hover:underline mt-4 inline-block"
            >
              Manage Users →
            </Link>
          </div>

          {/* Revenue Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ZMK {stats.totalRevenue}
                </p>
              </div>
              <BarChart3 className="text-green-600 w-8 h-8 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/products/new')}
              className="btn-primary"
            >
              + Add New Product
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="btn-secondary"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate('/users')}
              className="btn-secondary"
            >
              Manage User Records
            </button>
            <button
              onClick={() => navigate('/audit-log')}
              className="btn-secondary"
            >
              Audit Trail
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ZMK {order.total?.toFixed(2) || '0.00'}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'processing'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
