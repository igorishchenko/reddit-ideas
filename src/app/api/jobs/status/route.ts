import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();

    // Get idea statistics
    const { data: ideas, error: ideasError } = await supabase
      .from('ideas')
      .select('id, created_at, topic, overall_score, is_new');

    if (ideasError) {
      throw new Error(`Failed to fetch ideas: ${ideasError.message}`);
    }

    // Get Reddit posts statistics
    const { data: posts, error: postsError } = await supabase
      .from('reddit_posts')
      .select('id, processed_at, idea_generated, subreddit');

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`);
    }

    // Calculate statistics
    const totalIdeas = ideas?.length || 0;
    const newIdeas = ideas?.filter(idea => idea.is_new).length || 0;
    const totalPosts = posts?.length || 0;
    const processedPosts =
      posts?.filter(post => post.idea_generated).length || 0;

    // Group by topic
    const ideasByTopic =
      ideas?.reduce(
        (acc, idea) => {
          acc[idea.topic] = (acc[idea.topic] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    // Group by subreddit
    const postsBySubreddit =
      posts?.reduce(
        (acc, post) => {
          acc[post.subreddit] = (acc[post.subreddit] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    // Average score
    const avgScore =
      ideas?.length > 0
        ? Math.round(
            ideas.reduce((sum, idea) => sum + idea.overall_score, 0) /
              ideas.length
          )
        : 0;

    // Recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentIdeas =
      ideas?.filter(idea => new Date(idea.created_at) > new Date(oneDayAgo))
        .length || 0;

    return NextResponse.json({
      success: true,
      data: {
        ideas: {
          total: totalIdeas,
          new: newIdeas,
          averageScore: avgScore,
          recent24h: recentIdeas,
          byTopic: ideasByTopic,
        },
        posts: {
          total: totalPosts,
          processed: processedPosts,
          pending: totalPosts - processedPosts,
          bySubreddit: postsBySubreddit,
        },
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
