import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import heroSpices from '../assets/landingpage/3.png';
import featureQuality from '../assets/logo.png';
import featureShopping from '../assets/logo.png';
import featureFast from '../assets/logo.png';
import logo from '../assets/logo.png';
import feature from '../assets/landingpage/3.png';
import Footer from '../components/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-primary-900">
      <Navbar showCart={false} />

      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <div
        className="px-4 py-16 sm:px-6 lg:px-8 bg-primary-800 text-white"
        style={{
          backgroundImage: `url(${feature})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-5xl mx-auto bg-primary-800/90 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-center mb-12 text-white ">Why Choose us?</h3>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-primary-900 rounded-lg p-6 shadow-lg text-white">
              <img src={featureQuality} alt="Premium Quality" className="w-24 h-24 mx-auto mb-4 rounded-lg" />
              <h4 className="text-xl font-bold mb-2 text-center">Premium Quality</h4>
              <p className="text-white text-center">
                Handpicked ingredients sourced from the finest producers in Zambia and beyond.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-primary-900 rounded-lg p-6 shadow-lg text-white">
              <img src={featureShopping} alt="Easy Shopping" className="w-24 h-24 mx-auto mb-4 rounded-lg" />
              <h4 className="text-xl font-bold mb-2 text-center">Easy Shopping</h4>
              <p className="text-white text-center">
                Mobile-first platform designed for seamless browsing, ordering, and checkout.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-primary-900 rounded-lg p-6 shadow-lg text-white">
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
          <Link to="/store" className="inline-block px-8 py-3 bg-white text-primary-900 font-bold rounded-lg hover:bg-accent-light transition">
            Visit Store
          </Link>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default LandingPage;
