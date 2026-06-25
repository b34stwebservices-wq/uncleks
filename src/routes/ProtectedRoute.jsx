import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedRoute = ({ children, requireAdmin = false, allowPending = false }) => {
  const { user, loading, isAdmin, userRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-900 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/store" replace />;
  }

  if (!allowPending && userRole === 'pending') {
    return <Navigate to="/pending" replace />;
  }

  return children;
};

export default ProtectedRoute;
