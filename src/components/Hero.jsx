import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Navbar from '../components/Navbar';
import heroSpices from '../assets/landingpage/3.png';
import featureQuality from '../assets/logo.png';
import featureShopping from '../assets/logo.png';
import featureFast from '../assets/logo.png';
import logo from '../assets/logo.png';
import feature from '../assets/landingpage/3.png';

function Hero() {
  return (
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
  )
}

export default Hero