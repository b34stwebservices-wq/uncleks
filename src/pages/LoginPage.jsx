import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorAlert } from '../components/ErrorAlert';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png'

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/store');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar showCart={false} />

      <div className="min-h-screen bg-primary-900 flex items-center justify-center px-4 py-8">
        <ErrorAlert message={error} onDismiss={() => setError('')} />
        
        <div className="w-full max-w-md">
          {/* Brand Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="Uncle K's Logo" className="h-40 w-40 mx-auto mb-4" />
          </div>

          {/* Login Card */}
          <div className="card p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-900 text-center">Welcome Back</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-6"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-900 font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* Test Credentials (for demo) */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
