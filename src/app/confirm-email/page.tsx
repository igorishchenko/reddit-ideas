'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get email from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const storedEmail = localStorage.getItem('pendingEmail');

    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('pendingEmail', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Separate effect to handle redirect after email confirmation
  useEffect(() => {
    if (!loading && user?.email_confirmed_at) {
      setIsRedirecting(true);
      localStorage.removeItem('pendingEmail');
      // Small delay to show success message
      setTimeout(() => {
        router.push('/recommendations-feed');
      }, 1500);
    }
  }, [user, loading, router]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResendLoading(true);
    setResendMessage(null);

    try {
      const response = await fetch('/api/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setResendMessage('Confirmation email sent! Check your inbox.');
      } else {
        setResendMessage(data.error || 'Failed to resend email');
      }
    } catch (error) {
      setResendMessage('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToHome = () => {
    localStorage.removeItem('pendingEmail');
    router.push('/');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
        <div className='text-center'>
          <svg
            className='animate-spin h-8 w-8 text-gray-500 mx-auto mb-4'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          <p className='text-gray-600 dark:text-gray-300'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
      <div className='mx-auto max-w-2xl px-6 py-20 sm:py-24'>
        <div className='text-center'>
          {/* Logo */}
          <div className='flex items-center justify-center space-x-2 mb-8'>
            <div className='h-12 w-12 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center'>
              <span className='text-white dark:text-black font-bold text-lg'>
                R
              </span>
            </div>
            <span className='font-bold text-gray-900 dark:text-white text-xl'>
              Reddit Ideas
            </span>
          </div>

          {/* Main Content */}
          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-8 backdrop-blur'>
            {/* Email Icon */}
            <div className='mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6'>
              <svg
                className='w-8 h-8 text-blue-600 dark:text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
            </div>

            {isRedirecting ? (
              <>
                <h1 className='text-2xl font-bold text-green-600 dark:text-green-400 mb-4'>
                  Email Confirmed! 🎉
                </h1>

                <p className='text-gray-600 dark:text-gray-300 mb-6'>
                  Your email has been successfully confirmed. Redirecting you to
                  your ideas feed...
                </p>

                <div className='flex items-center justify-center mb-6'>
                  <svg
                    className='animate-spin h-8 w-8 text-green-600 dark:text-green-400'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                </div>
              </>
            ) : (
              <>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Check Your Email
                </h1>

                <p className='text-gray-600 dark:text-gray-300 mb-6'>
                  We've sent a confirmation link to{' '}
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {email || 'your email address'}
                  </span>
                </p>
              </>
            )}

            {!isRedirecting && (
              <>
                <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
                  <div className='flex items-start'>
                    <svg
                      className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <div className='text-sm text-blue-800 dark:text-blue-200'>
                      <p className='font-medium mb-1'>Next steps:</p>
                      <ol className='list-decimal list-inside space-y-1'>
                        <li>Check your email inbox (and spam folder)</li>
                        <li>Click the confirmation link in the email</li>
                        <li>Return here to access your account</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Resend Email */}
                <div className='space-y-4'>
                  <button
                    onClick={handleResendEmail}
                    disabled={resendLoading || !email}
                    className='w-full inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {resendLoading ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Resend Confirmation Email'
                    )}
                  </button>

                  {resendMessage && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        resendMessage.includes('sent')
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {resendMessage}
                    </div>
                  )}

                  <button
                    onClick={handleBackToHome}
                    className='w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
                  >
                    Back to Home
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className='mt-8 text-center'>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Didn't receive the email? Check your spam folder or contact
              support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
