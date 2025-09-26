'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [email, setEmail] = useState<string>('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleUnsubscribe();
    }
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/unsubscribe?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setEmail(data.email || '');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to unsubscribe',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleManualUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setEmail(data.email || '');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to unsubscribe',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
      <section className='mx-auto max-w-2xl px-6 py-20 sm:py-24'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Unsubscribe
          </h1>
          <p className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
            We're sorry to see you go. You can resubscribe anytime.
          </p>
        </div>

        <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-8 backdrop-blur'>
          {loading ? (
            <div className='text-center py-8'>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Processing unsubscribe request...
              </div>
            </div>
          ) : message ? (
            <div className='text-center py-8'>
              <div
                className={`text-lg font-medium ${
                  message.type === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {message.text}
              </div>
              {email && (
                <div className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
                  Email: {email}
                </div>
              )}
              {message.type === 'success' && (
                <div className='mt-6'>
                  <a
                    href='/subscribe'
                    className='inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                  >
                    Resubscribe
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-sm text-gray-600 dark:text-gray-300 mb-6'>
                If you have an unsubscribe link from an email, it should work
                automatically. Otherwise, please contact support.
              </p>
              <a
                href='/'
                className='inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              >
                Back to Home
              </a>
            </div>
          )}
        </div>

        <div className='mt-8 text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Questions? Contact us at{' '}
            <a
              href='mailto:support@example.com'
              className='underline hover:no-underline'
            >
              support@example.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
