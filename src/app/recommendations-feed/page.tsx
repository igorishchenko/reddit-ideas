'use client';

import { useMemo, useState, useEffect } from 'react';
import mock from '@/mock/reddit.json';
import type { RedditPost } from '@/types/reddit';

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

function mapSubredditToTopic(sub: string): string {
  const s = sub.toLowerCase();
  if (s.includes('dev')) return 'devtools';
  if (s.includes('teacher')) return 'education';
  if (s.includes('adhd') || s.includes('health')) return 'health';
  if (s.includes('free') || s.includes('finance')) return 'finance';
  if (s.includes('product')) return 'productivity';
  return 'other';
}

const POSTS = (mock as { posts: RedditPost[] }).posts;
const DERIVED_IDEAS: Idea[] = POSTS.map((p, idx) => ({
  id: `mock-${idx + 1}`,
  name: p.title.slice(0, 48),
  pitch: `Inspired by r/${p.subreddit}: ${p.title}`,
  painPoint: p.title,
  sources: [{ label: `r/${p.subreddit}`, url: p.url }],
  score: Math.min(100, Math.round(p.upvotes * 0.15 + p.numComments * 0.5)),
  topic: mapSubredditToTopic(p.subreddit),
  isNew: true,
}));

export default function RecommendationsFeedPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('all');
  const [minScore, setMinScore] = useState(0);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [useLLM, setUseLLM] = useState(false);

  // Load ideas on mount and when useLLM changes
  useEffect(() => {
    if (useLLM) {
      setLoading(true);
      fetch('/api/generate-ideas', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          setIdeas(data.ideas || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load LLM ideas:', err);
          setIdeas([]);
          setLoading(false);
        });
    } else {
      setIdeas(DERIVED_IDEAS);
    }
  }, [useLLM]);

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
            <div className='mt-3 flex items-center gap-2'>
              <label className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                <input
                  type='checkbox'
                  checked={useLLM}
                  onChange={(e) => setUseLLM(e.target.checked)}
                  className='mr-1'
                />
                Use AI-generated ideas
              </label>
              {loading && (
                <span className='text-xs text-gray-500'>
                  Generating ideas...
                </span>
              )}
            </div>
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
  );
}
