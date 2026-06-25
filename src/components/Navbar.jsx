import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

export const Navbar = ({ showCart = false, onCartClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const cartQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-primary-900 text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link to={isAdmin ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-lg sm:text-xl">
            <img src={logo} alt="Uncle K's Logo" className="h-24 w-24" />
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <div className="text-sm text-white/80">
                  Signed in as <span className="font-semibold text-white">{user.displayName || user.email}</span>
                </div>
                {isAdmin ? (
                  <>
                    <Link to="/dashboard" className="hover:text-accent-light transition">
                      Dashboard
                    </Link>
                    <Link to="/products" className="hover:text-accent-light transition">
                      Products
                    </Link>
                    <Link to="/orders" className="hover:text-accent-light transition">
                      Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/store" className="hover:text-accent-light transition">
                      Store
                    </Link>
                    <Link to="/my-orders" className="hover:text-accent-light transition">
                      My Orders
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-3 px-3 py-1 rounded-md bg-accent hover:bg-accent-light text-white font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-accent-light transition">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-1 rounded-md bg-white text-primary-900 font-medium hover:bg-gray-100 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {!isAdmin && showCart && (
              <button
                onClick={onCartClick}
                className="relative btn-icon p-2 rounded-lg text-white hover:bg-primary-800 transition"
              >
                <ShoppingCart size={24} />
                {cartQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-accent text-xs font-semibold text-white flex items-center justify-center px-1">
                    {cartQuantity}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-icon p-2 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary-800 border-t border-primary-700 px-4 py-4">
            <div className="space-y-3">
              {user ? (
                <> 
                  <div className="block py-2 text-sm text-white/80">
                    Signed in as <span className="font-semibold text-white">{user.displayName || user.email}</span>
                  </div>
                  {isAdmin ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block py-2 hover:text-accent-light transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-accent-light transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Products
                      </Link>
                      <Link
                        to="/orders"
                        className="block py-2 hover:text-accent-light transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/store"
                        className="block py-2 hover:text-accent-light transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Store
                      </Link>
                      <Link
                        to="/my-orders"
                        className="block py-2 hover:text-accent-light transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-accent-light hover:text-accent transition w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 hover:text-accent-light transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="block py-2 hover:text-accent-light transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                      to="/store"
                      className="block py-2 hover:text-accent-light transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Store
                    </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
