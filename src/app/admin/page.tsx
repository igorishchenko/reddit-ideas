'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';

type JobStatus = {
  success: boolean;
  data?: {
    ideas: {
      total: number;
      new: number;
      averageScore: number;
      recent24h: number;
      byTopic: Record<string, number>;
    };
    posts: {
      total: number;
      processed: number;
      pending: number;
      bySubreddit: Record<string, number>;
    };
    lastUpdated: string;
  };
  error?: string;
  message?: string;
};

export default function AdminPage() {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobRunning, setJobRunning] = useState(false);
  const [newsletterSending, setNewsletterSending] = useState(false);
  const [personalizedSending, setPersonalizedSending] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs/status');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const runJob = async () => {
    setJobRunning(true);
    try {
      const res = await fetch('/api/jobs/generate-ideas', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        alert(
          `Job completed successfully!\nProcessed: ${data.processedCount}\nErrors: ${data.errorCount}`
        );
        fetchStatus(); // Refresh status
      } else {
        alert(`Job failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to run job:', error);
      alert('Failed to run job');
    } finally {
      setJobRunning(false);
    }
  };

  const sendNewsletter = async () => {
    setNewsletterSending(true);
    try {
      const res = await fetch('/api/send-newsletter', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        alert(`Newsletter sent successfully! ${data.message}`);
      } else {
        alert(`Newsletter failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      alert('Failed to send newsletter');
    } finally {
      setNewsletterSending(false);
    }
  };

  const sendPersonalizedIdeas = async () => {
    setPersonalizedSending(true);
    try {
      const res = await fetch('/api/jobs/send-personalized-ideas', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        alert(`Personalized ideas sent successfully! ${data.message}`);
      } else {
        alert(`Personalized ideas failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to send personalized ideas:', error);
      alert('Failed to send personalized ideas');
    } finally {
      setPersonalizedSending(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <ProtectedRoute>
      <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
        <section className='mx-auto max-w-6xl px-6 py-20 sm:py-24'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Admin Dashboard
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
            Manage idea generation jobs and monitor system status.
          </p>

          <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Job Controls */}
            <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-6 backdrop-blur'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Job Controls
              </h2>
              <div className='space-y-3'>
                <button
                  onClick={runJob}
                  disabled={jobRunning}
                  className='w-full inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                >
                  {jobRunning ? 'Running Job...' : 'Run Idea Generation Job'}
                </button>
                <button
                  onClick={sendPersonalizedIdeas}
                  disabled={personalizedSending}
                  className='w-full inline-flex items-center justify-center rounded-full bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 disabled:opacity-60'
                >
                  {personalizedSending
                    ? 'Sending...'
                    : 'Send Personalized Ideas'}
                </button>
              </div>
            </div>

            {/* Ideas Stats */}
            <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-6 backdrop-blur'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Ideas Statistics
              </h2>
              {status?.data?.ideas ? (
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Total Ideas:
                    </span>
                    <span className='font-medium'>
                      {status.data.ideas.total}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      New Ideas:
                    </span>
                    <span className='font-medium text-green-600'>
                      {status.data.ideas.new}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Avg Score:
                    </span>
                    <span className='font-medium'>
                      {status.data.ideas.averageScore}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Last 24h:
                    </span>
                    <span className='font-medium'>
                      {status.data.ideas.recent24h}
                    </span>
                  </div>
                </div>
              ) : (
                <p className='text-sm text-gray-500'>No data available</p>
              )}
            </div>
          </div>

          {/* Topic Breakdown */}
          {status?.data?.ideas?.byTopic && (
            <div className='mt-8 rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-6 backdrop-blur'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Ideas by Topic
              </h2>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
                {Object.entries(status.data.ideas.byTopic).map(
                  ([topic, count]) => (
                    <div key={topic} className='text-center'>
                      <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {count}
                      </div>
                      <div className='text-xs text-gray-600 dark:text-gray-300 capitalize'>
                        {topic}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
