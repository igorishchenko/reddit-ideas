import { openai } from '@/lib/openai';
import { formatPrompt } from '@/lib/prompts';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import mock from '@/mock/reddit.json';
import type { RedditPost } from '@/types/reddit';
import { NextResponse } from 'next/server';

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
    const supabase = await getSupabaseServerClient();
    const posts = (mock as { posts: RedditPost[] }).posts;
    const generatedIdeas: GeneratedIdea[] = [];

    // Check which posts haven't been processed yet
    const postIds = posts.map(p => p.id);
    const { data: existingPosts } = await supabase
      .from('reddit_posts')
      .select('id')
      .in('id', postIds);

    const existingPostIds = new Set(existingPosts?.map(p => p.id) || []);
    const unprocessedPosts = posts.filter(p => !existingPostIds.has(p.id));

    if (unprocessedPosts.length === 0) {
      // No new posts to process, return existing ideas
      const { data: existingIdeas } = await supabase
        .from('ideas')
        .select(
          `
          *,
          idea_scores(*),
          idea_sources(*)
        `
        )
        .order('overall_score', { ascending: false });

      return NextResponse.json({
        ideas: existingIdeas || [],
        count: existingIdeas?.length || 0,
        message: 'No new posts to process',
        generatedAt: new Date().toISOString(),
      });
    }

    // Process each unprocessed post with LLM
    for (const post of unprocessedPosts) {
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

        // Parse JSON response (handle markdown code blocks)
        let llmIdea: LLMIdea;
        try {
          // Remove markdown code blocks if present
          const jsonContent = content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          llmIdea = JSON.parse(jsonContent);
        } catch {
          console.error('Failed to parse LLM response:', content);
          continue;
        }

        // Store in database
        const overallScore = calculateOverallScore(llmIdea.scores);

        // Insert idea
        const { data: ideaData, error: ideaError } = await supabase
          .from('ideas')
          .insert({
            name: llmIdea.name,
            pitch: llmIdea.pitch,
            pain_point: llmIdea.painPoint,
            target_audience: llmIdea.targetAudience,
            overall_score: overallScore,
            topic: llmIdea.topic,
            is_new: true,
          })
          .select()
          .single();

        if (ideaError) {
          console.error('Error inserting idea:', ideaError);
          continue;
        }

        // Insert detailed scores
        const { error: scoresError } = await supabase
          .from('idea_scores')
          .insert({
            idea_id: ideaData.id,
            pain_level: llmIdea.scores.painLevel,
            willingness_to_pay: llmIdea.scores.willingnessToPay,
            competition: llmIdea.scores.competition,
            tam: llmIdea.scores.tam,
            feasibility: llmIdea.scores.feasibility,
          });

        if (scoresError) {
          console.error('Error inserting scores:', scoresError);
        }

        // Insert source
        const { error: sourceError } = await supabase
          .from('idea_sources')
          .insert({
            idea_id: ideaData.id,
            subreddit: post.subreddit,
            post_url: post.url,
            post_title: post.title,
            upvotes: post.upvotes,
            num_comments: post.numComments,
          });

        if (sourceError) {
          console.error('Error inserting source:', sourceError);
        }

        // Mark post as processed
        await supabase.from('reddit_posts').insert({
          id: post.id,
          subreddit: post.subreddit,
          title: post.title,
          url: post.url,
          upvotes: post.upvotes,
          num_comments: post.numComments,
          idea_generated: true,
        });

        // Convert to our format for response
        const idea: GeneratedIdea = {
          id: ideaData.id,
          name: llmIdea.name,
          pitch: llmIdea.pitch,
          painPoint: llmIdea.painPoint,
          sources: [{ label: `r/${post.subreddit}`, url: post.url }],
          score: overallScore,
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

    // Get all ideas (newly generated + existing) sorted by score
    const { data: allIdeas } = await supabase
      .from('ideas')
      .select(
        `
        *,
        idea_scores(*),
        idea_sources(*)
      `
      )
      .order('overall_score', { ascending: false });

    return NextResponse.json({
      ideas: allIdeas || [],
      count: allIdeas?.length || 0,
      newlyGenerated: generatedIdeas.length,
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
