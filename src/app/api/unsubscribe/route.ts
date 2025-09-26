import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { z } from 'zod';

const unsubscribeSchema = z.object({
  token: z.string(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // Find subscription by token
    const { data: subscription, error: findError } = await supabase
      .from('email_subscriptions')
      .select('id, email, is_active')
      .eq('unsubscribe_token', token)
      .single();

    if (findError || !subscription) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    if (!subscription.is_active) {
      return NextResponse.json({
        success: true,
        message: 'Email was already unsubscribed',
        email: subscription.email,
      });
    }

    // Deactivate subscription
    const { error: updateError } = await supabase
      .from('email_subscriptions')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    if (updateError) {
      throw new Error(`Failed to unsubscribe: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
      email: subscription.email,
    });
  } catch (error) {
    console.error('Error in unsubscribe:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = unsubscribeSchema.parse(body);

    const supabase = getSupabaseAdminClient();

    // Find subscription by token
    const { data: subscription, error: findError } = await supabase
      .from('email_subscriptions')
      .select('id, email, is_active')
      .eq('unsubscribe_token', token)
      .single();

    if (findError || !subscription) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    if (!subscription.is_active) {
      return NextResponse.json({
        success: true,
        message: 'Email was already unsubscribed',
        email: subscription.email,
      });
    }

    // Deactivate subscription
    const { error: updateError } = await supabase
      .from('email_subscriptions')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    if (updateError) {
      throw new Error(`Failed to unsubscribe: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
      email: subscription.email,
    });
  } catch (error) {
    console.error('Error in unsubscribe:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
