'use client';

import { useMemo, useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

type Idea = {
  id: string;
  name: string;
  pitch: string;
  painPoint: string;
  sources: { label: string; url: string }[];
  score: number; // 0-100
  topic: string; // e.g., devtools, health, education
  isNew?: boolean;
  targetAudience?: string;
  detailedScores?: {
    painLevel: number;
    willingnessToPay: number;
    competition: number;
    tam: number;
    feasibility: number;
  };
};

const TOPICS = [
  'all',
  'devtools',
  'health',
  'education',
  'finance',
  'productivity',
] as const;

export default function RecommendationsFeedPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('all');
  const [minScore, setMinScore] = useState(0);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [subscribedIdeas, setSubscribedIdeas] = useState<Set<string>>(
    new Set()
  );
  const [subscribing, setSubscribing] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Subscribe to idea
  const handleSubscribe = async (ideaId: string) => {
    setSubscribing((prev) => new Set(prev).add(ideaId));
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });

      if (response.ok) {
        setSubscribedIdeas((prev) => new Set(prev).add(ideaId));
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setSubscribing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
    }
  };

  // Unsubscribe from idea
  const handleUnsubscribe = async (ideaId: string) => {
    setSubscribing((prev) => new Set(prev).add(ideaId));
    try {
      const response = await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });

      if (response.ok) {
        setSubscribedIdeas((prev) => {
          const newSet = new Set(prev);
          newSet.delete(ideaId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setSubscribing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
    }
  };

  // Load ideas on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Always fetch from database
    fetch('/api/ideas')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setIdeas(data.ideas || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load ideas:', err);
        setError('Failed to load ideas. Please try again.');
        setIdeas([]);
        setLoading(false);
      });
  }, []);

  const filteredIdeas = useMemo(() => {
    return ideas
      .filter((idea) => {
        const matchesTopic = topic === 'all' ? true : idea.topic === topic;
        const matchesScore = idea.score >= minScore;
        const q = query.trim().toLowerCase();
        const matchesQuery = !q
          ? true
          : [
              idea.name,
              idea.pitch,
              idea.painPoint,
              idea.sources.map((s) => s.label).join(' '),
            ].some((t) => t.toLowerCase().includes(q));
        return matchesTopic && matchesScore && matchesQuery;
      })
      .sort((a, b) => b.score - a.score);
  }, [ideas, query, topic, minScore]);

  return (
    <ProtectedRoute>
      <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
        <section className='mx-auto max-w-5xl px-6 py-20 sm:py-24'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
                Recommendations Feed
              </h1>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
                Fresh product ideas sourced from trending Reddit discussions.
              </p>
              <div className='mt-3'>
                <a
                  href='/subscribe'
                  className='inline-flex items-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                >
                  Get ideas via email
                </a>
              </div>
              {loading && (
                <div className='mt-3 flex items-center gap-2'>
                  <svg
                    className='animate-spin h-4 w-4 text-gray-500'
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
                  <span className='text-xs text-gray-500'>
                    Loading ideas from database...
                  </span>
                </div>
              )}
              {error && (
                <div className='mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <svg
                      className='h-4 w-4 text-red-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='text-sm text-red-700 dark:text-red-300'>
                      {error}
                    </span>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className='mt-2 text-xs text-red-600 dark:text-red-400 hover:underline'
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center'>
              <div className='flex items-center gap-2'>
                <label className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value as (typeof TOPICS)[number])
                  }
                  className='rounded-full border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/[.02] px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none'
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex items-center gap-2'>
                <label className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                  Min score
                </label>
                <input
                  type='number'
                  min={0}
                  max={100}
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value) || 0)}
                  className='w-[88px] rounded-full border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/[.02] px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none'
                />
              </div>

              <div className='flex items-center gap-2'>
                <label className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                  Search
                </label>
                <input
                  placeholder='e.g., invoice, ADHD, CI'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className='w-full sm:w-[220px] rounded-full border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/[.02] px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none'
                />
              </div>
            </div>
          </div>

          <div className='mt-8 grid gap-4'>
            {filteredIdeas.map((idea) => (
              <article
                key={idea.id}
                className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-5 backdrop-blur'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-base font-semibold text-gray-900 dark:text-white'>
                        {idea.name}
                      </h2>
                      {idea.isNew ? (
                        <span className='inline-flex items-center rounded-full bg-green-600/10 text-green-700 dark:text-green-300 ring-1 ring-green-600/20 px-2 py-0.5 text-[10px] font-semibold'>
                          New
                        </span>
                      ) : null}
                      <span className='inline-flex items-center rounded-full bg-black/[.04] dark:bg-white/[.06] ring-1 ring-black/[.06] dark:ring-white/[.08] px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300'>
                        {idea.topic}
                      </span>
                    </div>
                    <p className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                      {idea.pitch}
                    </p>
                    {idea.targetAudience && (
                      <p className='mt-1 text-xs text-gray-600 dark:text-gray-400'>
                        Target: {idea.targetAudience}
                      </p>
                    )}
                  </div>

                  <div className='shrink-0 text-right'>
                    <div className='text-xs font-medium text-gray-600 dark:text-gray-300'>
                      Score
                    </div>
                    <div className='mt-0.5 text-xl font-bold text-gray-900 dark:text-white'>
                      {idea.score}
                    </div>
                    {idea.detailedScores && (
                      <div className='mt-2 grid grid-cols-2 gap-1 text-[10px] text-gray-500 dark:text-gray-400'>
                        <div>Pain: {idea.detailedScores.painLevel}</div>
                        <div>Pay: {idea.detailedScores.willingnessToPay}</div>
                        <div>Comp: {idea.detailedScores.competition}</div>
                        <div>TAM: {idea.detailedScores.tam}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center'>
                  <div>
                    <div className='text-xs font-medium text-gray-800 dark:text-gray-200'>
                      Key insight
                    </div>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                      {idea.painPoint}
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {idea.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center rounded-full border border-gray-300 dark:border-white/20 px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                      >
                        {s.label}
                      </a>
                    ))}
                    <button
                      onClick={() => {
                        const isSubscribed = subscribedIdeas.has(idea.id);
                        if (isSubscribed) {
                          handleUnsubscribe(idea.id);
                        } else {
                          handleSubscribe(idea.id);
                        }
                      }}
                      disabled={subscribing.has(idea.id)}
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                        subscribedIdeas.has(idea.id)
                          ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30'
                          : 'border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5'
                      } ${
                        subscribing.has(idea.id)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      {subscribing.has(idea.id) ? (
                        <>
                          <svg
                            className='animate-spin -ml-1 mr-1 h-3 w-3'
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
                          {subscribedIdeas.has(idea.id)
                            ? 'Unsubscribing...'
                            : 'Subscribing...'}
                        </>
                      ) : subscribedIdeas.has(idea.id) ? (
                        '✓ Subscribed'
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredIdeas.length === 0 ? (
              <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 text-sm text-gray-600 dark:text-gray-300'>
                No ideas match your filters. Try lowering the score or switching
                topic.
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
