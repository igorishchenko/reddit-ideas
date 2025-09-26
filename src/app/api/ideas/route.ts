import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();

    const { data: ideas, error } = await supabase
      .from('ideas')
      .select(
        `
        *,
        idea_scores(*),
        idea_sources(*)
      `
      )
      .order('overall_score', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ideas' },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const transformedIdeas =
      ideas?.map(idea => ({
        id: idea.id,
        name: idea.name,
        pitch: idea.pitch,
        painPoint: idea.pain_point,
        sources:
          idea.idea_sources?.map(
            (source: { subreddit: string; post_url: string }) => ({
              label: `r/${source.subreddit}`,
              url: source.post_url,
            })
          ) || [],
        score: idea.overall_score,
        topic: idea.topic,
        isNew: idea.is_new,
        targetAudience: idea.target_audience,
        detailedScores: idea.idea_scores?.[0]
          ? {
              painLevel: idea.idea_scores[0].pain_level,
              willingnessToPay: idea.idea_scores[0].willingness_to_pay,
              competition: idea.idea_scores[0].competition,
              tam: idea.idea_scores[0].tam,
              feasibility: idea.idea_scores[0].feasibility,
            }
          : undefined,
      })) || [];

    return NextResponse.json({
      ideas: transformedIdeas,
      count: transformedIdeas.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in ideas API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}
