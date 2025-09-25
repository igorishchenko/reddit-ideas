import { NextResponse } from 'next/server';
import mock from '@/mock/reddit.json';
import type { RedditPost } from '@/types/reddit';

export async function GET() {
  const posts = (mock as { posts: RedditPost[] }).posts;

  // Derive simplistic idea candidates from mock posts
  const ideas = posts.map((p, idx) => ({
    id: `mock-${idx + 1}`,
    name: p.title.slice(0, 48),
    pitch: `Inspired by r/${p.subreddit}: ${p.title}`,
    painPoint: p.title,
    sources: [{ label: `r/${p.subreddit}`, url: p.url }],
    score: Math.min(100, Math.round(p.upvotes * 0.15 + p.numComments * 0.5)),
    topic: mapSubredditToTopic(p.subreddit),
    isNew: true,
  }));

  return NextResponse.json({ ideas });
}

function mapSubredditToTopic(sub: string): string {
  const s = sub.toLowerCase();
  if (s.includes('dev')) return 'devtools';
  if (s.includes('teacher')) return 'education';
  if (s.includes('adhd') || s.includes('health')) return 'health';
  if (s.includes('free') || s.includes('finance')) return 'finance';
  if (s.includes('product')) return 'productivity';
  return 'other';
}
