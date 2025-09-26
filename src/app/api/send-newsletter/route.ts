import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';

export async function POST() {
  try {
    const supabase = getSupabaseAdminClient();

    // Get active email subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('email_subscriptions')
      .select('*')
      .eq('is_active', true);

    if (subsError) {
      throw new Error(`Failed to fetch subscriptions: ${subsError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active subscriptions found',
        sent: 0,
      });
    }

    // Get recent ideas (last 7 days)
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    const { data: ideas, error: ideasError } = await supabase
      .from('ideas')
      .select(
        `
        *,
        idea_scores(*),
        idea_sources(*)
      `
      )
      .gte('created_at', sevenDaysAgo)
      .order('overall_score', { ascending: false })
      .limit(10);

    if (ideasError) {
      throw new Error(`Failed to fetch ideas: ${ideasError.message}`);
    }

    if (!ideas || ideas.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new ideas to send',
        sent: 0,
      });
    }

    let sentCount = 0;
    const errors: string[] = [];

    // Send emails to each subscription
    for (const subscription of subscriptions) {
      try {
        // Filter ideas by subscription topics
        const filteredIdeas =
          subscription.topics.length > 0
            ? ideas.filter((idea) => subscription.topics.includes(idea.topic))
            : ideas;

        if (filteredIdeas.length === 0) {
          continue; // Skip if no ideas match their topics
        }

        // Generate email content
        const ideasHtml = filteredIdeas
          .map(
            (idea) => `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; background: #f9fafb;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
              <h3 style="margin: 0; color: #111827; font-size: 18px;">${
                idea.name
              }</h3>
              <div style="text-align: right;">
                <div style="font-size: 12px; color: #6b7280;">Score</div>
                <div style="font-size: 24px; font-weight: bold; color: #111827;">${
                  idea.overall_score
                }</div>
              </div>
            </div>
            <p style="margin: 8px 0; color: #374151; font-size: 14px;">${
              idea.pitch
            }</p>
            <div style="margin: 12px 0;">
              <div style="font-size: 12px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">Key insight</div>
              <p style="margin: 0; color: #4b5563; font-size: 13px;">${
                idea.pain_point
              }</p>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;">
              ${
                idea.idea_sources
                  ?.map(
                    (source: { post_url: string; subreddit: string }) => `
                <a href="${source.post_url}" style="
                  display: inline-block;
                  padding: 4px 12px;
                  background: #f3f4f6;
                  color: #374151;
                  text-decoration: none;
                  border-radius: 16px;
                  font-size: 12px;
                  border: 1px solid #d1d5db;
                ">r/${source.subreddit}</a>
              `
                  )
                  .join('') || ''
              }
              <span style="
                display: inline-block;
                padding: 4px 12px;
                background: #e5e7eb;
                color: #374151;
                border-radius: 16px;
                font-size: 12px;
                text-transform: capitalize;
              ">${idea.topic}</span>
            </div>
          </div>
        `
          )
          .join('');

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <h1 style="color: #111827; margin: 0; font-size: 28px;">Fresh Product Ideas</h1>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">
                Curated from trending Reddit discussions
              </p>
            </div>
            
            <div style="padding: 20px;">
              <p style="color: #374151; margin: 0 0 20px 0;">
                Here are the latest product ideas that match your interests:
              </p>
              
              ${ideasHtml}
              
              <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 14px;">
                  Want to see more ideas? Visit our feed for real-time updates.
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/recommendations-feed" style="
                  display: inline-block;
                  background: #111827;
                  color: #ffffff;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                ">View All Ideas</a>
              </div>
            </div>
            
            <div style="padding: 20px; border-top: 1px solid #e5e7eb; text-align: center; background: #f9fafb;">
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 12px;">
                You're receiving this because you subscribed to Reddit Ideas.
              </p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${subscription.unsubscribe_token}" 
                 style="color: #dc2626; text-decoration: none; font-size: 12px;">
                Unsubscribe
              </a>
            </div>
          </div>
        `;

        // Send email
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'ideas@example.com',
          to: subscription.email,
          subject: `Fresh Ideas: ${filteredIdeas.length} new product opportunities`,
          html: emailHtml,
        });

        sentCount++;
        console.log(`[NEWSLETTER] Sent to ${subscription.email}`);
      } catch (emailError) {
        const errorMsg = `Failed to send to ${subscription.email}: ${emailError}`;
        console.error(`[NEWSLETTER] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${sentCount} subscribers`,
      sent: sentCount,
      errors: errors.slice(0, 10), // Limit error details
    });
  } catch (error) {
    console.error('Error in newsletter API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send newsletter',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
