'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';

const TOPICS = [
  'devtools',
  'health',
  'education',
  'finance',
  'productivity',
] as const;

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleTopicToggle = (topic: string) => {
    setTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          topics,
          frequency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
        setTopics([]);
        setFrequency('weekly');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to subscribe',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
        <section className='mx-auto max-w-2xl px-6 py-20 sm:py-24'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
              Get Fresh Ideas in Your Inbox
            </h1>
            <p className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
              Subscribe to receive curated product ideas sourced from trending
              Reddit discussions.
            </p>
          </div>

          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-8 backdrop-blur'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email Input */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Email Address
                </label>
                <input
                  id='email'
                  type='email'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white/80 dark:bg-white/[.02] px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20'
                  placeholder='your@email.com'
                />
              </div>

              {/* Topic Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                  Topics (select all that interest you)
                </label>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  {TOPICS.map(topic => (
                    <label
                      key={topic}
                      className='flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                    >
                      <input
                        type='checkbox'
                        checked={topics.includes(topic)}
                        onChange={() => handleTopicToggle(topic)}
                        className='rounded border-gray-300 text-gray-900 focus:ring-gray-900/20'
                      />
                      <span className='text-sm text-gray-700 dark:text-gray-300 capitalize'>
                        {topic}
                      </span>
                    </label>
                  ))}
                </div>
                <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                  Leave empty to receive ideas from all topics
                </p>
              </div>

              {/* Frequency Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                  Email Frequency
                </label>
                <div className='space-y-2'>
                  <label className='flex items-center space-x-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='frequency'
                      value='weekly'
                      checked={frequency === 'weekly'}
                      onChange={e => setFrequency(e.target.value as 'weekly')}
                      className='text-gray-900 focus:ring-gray-900/20'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      Weekly digest (recommended)
                    </span>
                  </label>
                  <label className='flex items-center space-x-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='frequency'
                      value='daily'
                      checked={frequency === 'daily'}
                      onChange={e => setFrequency(e.target.value as 'daily')}
                      className='text-gray-900 focus:ring-gray-900/20'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      Daily updates
                    </span>
                  </label>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-100'
              >
                {loading ? 'Subscribing...' : 'Subscribe to Ideas'}
              </button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                By subscribing, you agree to receive product ideas and can
                unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
