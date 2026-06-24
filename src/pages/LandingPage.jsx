import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Navbar from '../components/Navbar';
import heroSpices from '../assets/landingpage/3.png';
import featureQuality from '../assets/landingpage/123.jpg';
import featureShopping from '../assets/landingpage/5.png';
import featureFast from '../assets/logo.png';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-primary-900">
      <Navbar showCart={false} />

      {/* Hero Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 text-center bg-primary-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight text-accent-light">
                Proudly Zambian Boldly Flavorful
              </h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
                Discover premium sauces, spice blends, and pantry staples handcrafted for authentic Zambian taste.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link to="/store" className="px-6 py-3 bg-white text-accent font-semibold rounded-lg transition transform hover:scale-105">
                  Explore Store
                </Link>
                <Link to="/login" className="px-6 py-3 bg-white text-primary-900 font-semibold rounded-lg hover:bg-gray-100 transition">
                  Sign In
                </Link>
                <Link to="/register" className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition">
                  Create Account
                </Link>
              </div>
            </div>
            <div>
              <img src={heroSpices} alt="Premium Spices" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-primary-900 text-white">
            <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-white ">Why Choose us?</h3>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-primary-800 rounded-lg p-6 shadow-lg text-white">
              <img src={featureQuality} alt="Premium Quality" className="w-24 h-24 mx-auto mb-4 rounded-lg" />
              <h4 className="text-xl font-bold mb-2 text-center">Premium Quality</h4>
              <p className="text-white text-center">
                Handpicked ingredients sourced from the finest producers in Zambia and beyond.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-primary-800 rounded-lg p-6 shadow-lg text-white">
              <img src={featureShopping} alt="Easy Shopping" className="w-24 h-24 mx-auto mb-4 rounded-lg" />
              <h4 className="text-xl font-bold mb-2 text-center">Easy Shopping</h4>
              <p className="text-white text-center">
                Mobile-first platform designed for seamless browsing, ordering, and checkout.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-primary-800 rounded-lg p-6 shadow-lg text-white">
              <img src={featureFast} alt="Fast Service" className="w-24 h-24 mx-auto mb-4 rounded-lg" />
              <h4 className="text-xl font-bold mb-2 text-center">Fast Service</h4>
              <p className="text-white text-center">
                Quick order processing and reliable delivery to bring flavor to your table fast.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-primary-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Experience Bold Flavor?</h3>
          <p className="text-lg mb-8 text-white">
            Join thousands of flavor enthusiasts enjoying Uncle K's products.
          </p>
          <Link to="/register" className="inline-block px-8 py-3 bg-white text-primary-900 font-bold rounded-lg hover:bg-gray-100 transition">
            Create Your Account Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary-500 px-4 py-8 sm:px-6 lg:px-8 bg-primary-700 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p>Uncle K's - Proudly Zambian</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://www.instagram.com/uncleks" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-gray-200">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/uncleks" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-gray-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.tiktok.com/@uncleks" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-gray-200">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm mt-2">© 2026 Uncle K's. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
