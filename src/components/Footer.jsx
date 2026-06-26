import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import logo from '../assets/logo.png';

function Footer() {
  return (
    <>
        <footer className="border-t border-primary-500 px-4 py-8 sm:px-6 lg:px-8 bg-primary-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <img src={logo} alt="Uncle K's Logo" className="h-16 w-16 mx-auto mb-4" />
          <p>Uncle K's - Proudly Zambian</p>
          <div className="mt-4 flex justify-center gap-4">
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
    </>
  )
}

export default Footer