'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut, isAuthenticated } = useAuth();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/[.02]'>
      <div className='mx-auto max-w-7xl px-6'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center'>
              <span className='text-white dark:text-black font-bold text-sm'>
                R
              </span>
            </div>
            <span className='font-bold text-gray-900 dark:text-white'>
              Reddit Ideas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {isAuthenticated ? (
              <>
                <Link
                  href='/recommendations-feed'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  Ideas Feed
                </Link>
                <Link
                  href='/admin'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  Admin
                </Link>
              </>
            ) : (
              <>
                <Link
                  href='/how-it-works'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  How it Works
                </Link>
                <Link
                  href='/pricing'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* Auth Links */}
          <div className='hidden md:flex items-center space-x-4'>
            {loading ? (
              <div className='text-sm text-gray-500'>Loading...</div>
            ) : isAuthenticated ? (
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  {user?.email}
                </span>
                <button
                  onClick={signOut}
                  className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='inline-flex items-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-black/[.06] dark:border-white/[.08] py-4'>
            <nav className='flex flex-col space-y-4'>
              {isAuthenticated ? (
                <>
                  <Link
                    href='/recommendations-feed'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ideas Feed
                  </Link>
                  <Link
                    href='/admin'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href='/how-it-works'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How it Works
                  </Link>
                  <Link
                    href='/pricing'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </>
              )}
              <div className='pt-4 border-t border-black/[.06] dark:border-white/[.08]'>
                {loading ? (
                  <div className='text-sm text-gray-500'>Loading...</div>
                ) : isAuthenticated ? (
                  <div className='space-y-2'>
                    <div className='text-sm text-gray-700 dark:text-gray-300'>
                      {user?.email}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href='/login'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-2'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href='/signup'
                      className='inline-flex items-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
