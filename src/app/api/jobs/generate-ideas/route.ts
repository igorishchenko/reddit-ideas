import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { formatPrompt } from '@/lib/prompts';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
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

function calculateOverallScore(scores: LLMIdea['scores']): number {
  const weights = {
    painLevel: 0.3,
    willingnessToPay: 0.25,
    tam: 0.2,
    feasibility: 0.15,
    competition: 0.1,
  };

  const competitionScore = 100 - scores.competition;

  return Math.round(
    scores.painLevel * weights.painLevel +
      scores.willingnessToPay * weights.willingnessToPay +
      scores.tam * weights.tam +
      scores.feasibility * weights.feasibility +
      competitionScore * weights.competition
  );
}

export async function POST() {
  const startTime = Date.now();
  let processedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  try {
    const supabase = await getSupabaseServerClient();
    const posts = (mock as { posts: RedditPost[] }).posts;

    console.log(`[JOB] Starting idea generation for ${posts.length} posts`);

    // Check which posts haven't been processed yet
    const postIds = posts.map(p => p.id);
    const { data: existingPosts } = await supabase
      .from('reddit_posts')
      .select('id')
      .in('id', postIds);

    const existingPostIds = new Set(existingPosts?.map(p => p.id) || []);
    const unprocessedPosts = posts.filter(p => !existingPostIds.has(p.id));

    if (unprocessedPosts.length === 0) {
      console.log('[JOB] No new posts to process');
      return NextResponse.json({
        success: true,
        message: 'No new posts to process',
        processedCount: 0,
        errorCount: 0,
        duration: Date.now() - startTime,
      });
    }

    console.log(`[JOB] Processing ${unprocessedPosts.length} new posts`);

    // Process each unprocessed post with LLM
    for (const post of unprocessedPosts) {
      try {
        console.log(`[JOB] Processing post: ${post.id} - ${post.title}`);

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
          throw new Error('No content from OpenAI');
        }

        // Parse JSON response (handle markdown code blocks)
        let llmIdea: LLMIdea;
        try {
          const jsonContent = content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          llmIdea = JSON.parse(jsonContent);
        } catch (parseError) {
          throw new Error(`Failed to parse LLM response: ${parseError}`);
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
          throw new Error(`Failed to insert idea: ${ideaError.message}`);
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
          console.error(
            `[JOB] Error inserting scores for idea ${ideaData.id}:`,
            scoresError
          );
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
          console.error(
            `[JOB] Error inserting source for idea ${ideaData.id}:`,
            sourceError
          );
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

        processedCount++;
        console.log(
          `[JOB] Successfully processed post ${post.id} -> idea ${ideaData.id}`
        );
      } catch (error) {
        errorCount++;
        const errorMsg = `Error processing post ${post.id}: ${error}`;
        console.error(`[JOB] ${errorMsg}`);
        errors.push(errorMsg);
        continue;
      }
    }

    const duration = Date.now() - startTime;
    console.log(
      `[JOB] Completed in ${duration}ms. Processed: ${processedCount}, Errors: ${errorCount}`
    );

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} posts successfully`,
      processedCount,
      errorCount,
      errors: errors.slice(0, 10), // Limit error details
      duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[JOB] Fatal error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Job failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        processedCount,
        errorCount,
        duration,
      },
      { status: 500 }
    );
  }
}
