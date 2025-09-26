-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ideas table
CREATE TABLE ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  pitch TEXT NOT NULL,
  pain_point TEXT NOT NULL,
  target_audience VARCHAR(200),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  topic VARCHAR(50) NOT NULL,
  is_new BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detailed scores table
CREATE TABLE idea_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  pain_level INTEGER NOT NULL CHECK (pain_level >= 0 AND pain_level <= 100),
  willingness_to_pay INTEGER NOT NULL CHECK (willingness_to_pay >= 0 AND willingness_to_pay <= 100),
  competition INTEGER NOT NULL CHECK (competition >= 0 AND competition <= 100),
  tam INTEGER NOT NULL CHECK (tam >= 0 AND tam <= 100),
  feasibility INTEGER NOT NULL CHECK (feasibility >= 0 AND feasibility <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sources table (Reddit posts that inspired the idea)
CREATE TABLE idea_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  subreddit VARCHAR(100) NOT NULL,
  post_url TEXT NOT NULL,
  post_title TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  num_comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (users subscribed to idea updates)
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL, -- Supabase auth user ID
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, idea_id)
);

-- Email subscriptions table
CREATE TABLE email_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  topics TEXT[] DEFAULT '{}', -- Array of topic strings
  frequency VARCHAR(20) DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly')),
  is_active BOOLEAN DEFAULT true,
  unsubscribe_token VARCHAR(255) UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email)
);

-- Reddit posts table (to track what we've processed)
CREATE TABLE reddit_posts (
  id VARCHAR(50) PRIMARY KEY, -- Reddit post ID
  subreddit VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  num_comments INTEGER DEFAULT 0,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  idea_generated BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX idx_ideas_topic ON ideas(topic);
CREATE INDEX idx_ideas_score ON ideas(overall_score DESC);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_is_new ON ideas(is_new);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_reddit_posts_processed ON reddit_posts(processed_at);
CREATE INDEX idx_reddit_posts_idea_generated ON reddit_posts(idea_generated);
CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX idx_email_subscriptions_active ON email_subscriptions(is_active);
CREATE INDEX idx_email_subscriptions_token ON email_subscriptions(unsubscribe_token);

-- RLS (Row Level Security) policies
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read ideas
CREATE POLICY "Allow authenticated users to read ideas" ON ideas
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to read idea scores
CREATE POLICY "Allow authenticated users to read idea_scores" ON idea_scores
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to read idea sources
CREATE POLICY "Allow authenticated users to read idea_sources" ON idea_sources
  FOR SELECT TO authenticated USING (true);

-- Allow users to manage their own subscriptions
CREATE POLICY "Users can manage own subscriptions" ON subscriptions
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Allow service role to manage all data (for API operations)
CREATE POLICY "Service role can manage all data" ON ideas
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role can manage all data" ON idea_scores
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role can manage all data" ON idea_sources
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role can manage all data" ON subscriptions
  FOR ALL TO service_role USING (true);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Service role can manage all data" ON email_subscriptions;
DROP POLICY IF EXISTS "Allow anonymous email subscription" ON email_subscriptions;
DROP POLICY IF EXISTS "Allow service role email subscription" ON email_subscriptions;

-- Create comprehensive policies for email_subscriptions
CREATE POLICY "Allow all operations for service role" ON email_subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anonymous users" ON email_subscriptions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role can manage all data" ON reddit_posts
  FOR ALL TO service_role USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
