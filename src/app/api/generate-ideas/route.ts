import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { formatPrompt } from '@/lib/prompts';
import mock from '@/mock/reddit.json';
import type { RedditPost } from '@/types/reddit';

type LLMIdea = {
  name: string;
  pitch: string;
  painPoint: string;
  targetAudience: string;
  scores: {
    painLevel: number;
    willingnessToPay: number;
    competition: number;
    tam: number;
    feasibility: number;
  };
  topic: string;
};

type GeneratedIdea = {
  id: string;
  name: string;
  pitch: string;
  painPoint: string;
  sources: { label: string; url: string }[];
  score: number; // 0-100 overall score
  topic: string;
  isNew?: boolean;
  targetAudience: string;
  detailedScores: {
    painLevel: number;
    willingnessToPay: number;
    competition: number;
    tam: number;
    feasibility: number;
  };
};

function calculateOverallScore(scores: LLMIdea['scores']): number {
  // Weighted average: pain (30%), willingness to pay (25%), TAM (20%), feasibility (15%), competition (10%)
  const weights = {
    painLevel: 0.3,
    willingnessToPay: 0.25,
    tam: 0.2,
    feasibility: 0.15,
    competition: 0.1, // Lower competition = higher score
  };

  const competitionScore = 100 - scores.competition; // Invert competition score

  return Math.round(
    scores.painLevel * weights.painLevel +
      scores.willingnessToPay * weights.willingnessToPay +
      scores.tam * weights.tam +
      scores.feasibility * weights.feasibility +
      competitionScore * weights.competition
  );
}

export async function POST() {
  try {
    const posts = (mock as { posts: RedditPost[] }).posts;
    const generatedIdeas: GeneratedIdea[] = [];

    // Process each post with LLM
    for (const post of posts) {
      try {
        const prompt = formatPrompt(
          post.title,
          post.subreddit,
          post.upvotes,
          post.numComments
        );

        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
          console.error('No content from OpenAI for post:', post.id);
          continue;
        }

        // Parse JSON response
        let llmIdea: LLMIdea;
        try {
          llmIdea = JSON.parse(content);
        } catch (parseError) {
          console.error('Failed to parse LLM response:', content);
          continue;
        }

        // Convert to our format
        const idea: GeneratedIdea = {
          id: `llm-${post.id}`,
          name: llmIdea.name,
          pitch: llmIdea.pitch,
          painPoint: llmIdea.painPoint,
          sources: [{ label: `r/${post.subreddit}`, url: post.url }],
          score: calculateOverallScore(llmIdea.scores),
          topic: llmIdea.topic,
          isNew: true,
          targetAudience: llmIdea.targetAudience,
          detailedScores: llmIdea.scores,
        };

        generatedIdeas.push(idea);
      } catch (error) {
        console.error('Error processing post:', post.id, error);
        continue;
      }
    }

    // Sort by score descending
    generatedIdeas.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      ideas: generatedIdeas,
      count: generatedIdeas.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in generate-ideas API:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
