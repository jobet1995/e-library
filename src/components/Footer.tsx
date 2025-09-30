import Link from "next/link";
import { BookOpen, Github, Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-900/95 backdrop-blur-md text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-xl">
                <BookOpen className="h-8 w-8 text-black" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  E-Library
                </span>
                <p className="text-sm text-gray-400">
                  Digital Reading Platform
                </p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your modern digital library platform for discovering, reading, and
              managing books online. Experience the future of digital reading
              with our comprehensive library system.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@elibrary.com"
                className="p-2 bg-white/10 rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+1234567890"
                className="p-2 bg-white/10 rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Library Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              📚 Library
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/books"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/my-books"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  My Library
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/books/upload"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Upload Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              👤 Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/profile"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/wishlist"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              🛟 Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@elibrary.com"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-400">10,000+</div>
              <div className="text-sm text-gray-400">Books Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-400">5,000+</div>
              <div className="text-sm text-gray-400">Active Readers</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-400">50+</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-400">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} E-Library Digital Platform. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Built with Next.js, Firebase & Prisma</span>
              <span className="text-yellow-400">📚 Happy Reading!</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
