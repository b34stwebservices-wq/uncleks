import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-primary-900 text-white font-bold rounded-lg hover:bg-primary-800 transition">
            Go Home
          </Link>
          <Link to="/store" className="px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
