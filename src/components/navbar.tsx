'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Check-Inn Logo" className="h-16 w-16" />
          <span className="text-xl font-bold text-blue-600">Check-Inn</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-6 text-gray-600 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/my-bookings" className="hover:text-blue-600 transition">My Bookings</Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
