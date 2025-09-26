import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
  topics: z.array(z.string()).optional().default([]),
  frequency: z.enum(['daily', 'weekly']).optional().default('weekly'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, topics, frequency } = subscribeSchema.parse(body);

    const supabase = getSupabaseAdminClient();

    // Check if email already exists
    const { data: existingSubscription } = await supabase
      .from('email_subscriptions')
      .select('id, is_active, unsubscribe_token')
      .eq('email', email)
      .single();

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await supabase
          .from('email_subscriptions')
          .update({
            topics,
            frequency,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubscription.id);

        // Send reactivation email
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'ideas@example.com',
            to: email,
            subject: 'Welcome back to Reddit Ideas! 🎉',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Welcome back!</h1>
                <p>Great to have you back! Your email subscription has been reactivated.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Your Updated Preferences:</h3>
                  <p><strong>Topics:</strong> ${
                    topics.length > 0 ? topics.join(', ') : 'All topics'
                  }</p>
                  <p><strong>Frequency:</strong> ${
                    frequency === 'daily' ? 'Daily' : 'Weekly'
                  }</p>
                </div>
                
                <p>You'll start receiving fresh product ideas again based on your preferences. We're excited to share the latest insights from Reddit discussions!</p>
                
                <div style="margin: 30px 0;">
                  <a href="${
                    process.env.NEXT_PUBLIC_SITE_URL
                  }/recommendations-feed" 
                     style="background: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    View Latest Ideas
                  </a>
                </div>
                
                <div style="margin: 30px 0;">
                  <a href="${
                    process.env.NEXT_PUBLIC_SITE_URL
                  }/unsubscribe?token=${
                    existingSubscription.unsubscribe_token
                  }" 
                     style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Unsubscribe
                  </a>
                </div>
                
                <p style="color: #666; font-size: 12px;">
                  This email was sent to ${email}. If you didn't reactivate your subscription, you can safely ignore this email.
                </p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send reactivation email:', emailError);
          // Don't fail the reactivation if email fails
        }

        return NextResponse.json({
          success: true,
          message:
            'Subscription reactivated! Check your email for confirmation.',
        });
      }
    }

    // Create new subscription
    const { data: subscription, error: insertError } = await supabase
      .from('email_subscriptions')
      .insert({
        email,
        topics,
        frequency,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create subscription: ${insertError.message}`);
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'ideas@example.com',
        to: email,
        subject: 'Welcome to Reddit Ideas! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Reddit Ideas!</h1>
            <p>You're now subscribed to receive fresh product ideas sourced from trending Reddit discussions.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Preferences:</h3>
              <p><strong>Topics:</strong> ${
                topics.length > 0 ? topics.join(', ') : 'All topics'
              }</p>
              <p><strong>Frequency:</strong> ${
                frequency === 'daily' ? 'Daily' : 'Weekly'
              }</p>
            </div>
            
            <p>We'll send you curated product ideas based on your preferences. You can update your subscription or unsubscribe at any time.</p>
            
            <div style="margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${
                subscription.unsubscribe_token
              }" 
                 style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Unsubscribe
              </a>
            </div>
            
            <p style="color: #666; font-size: 12px;">
              This email was sent to ${email}. If you didn't subscribe, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error('Error in email subscription:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
