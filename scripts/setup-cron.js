#!/usr/bin/env node

/**
 * Setup script for scheduling personalized idea emails
 * This script helps set up a cron job to send personalized ideas every minute
 *
 * Usage:
 * 1. Run: node scripts/setup-cron.js
 * 2. Follow the instructions to set up your cron job
 */

// This script provides setup instructions for cron jobs

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

console.log('🚀 Reddit Ideas - Personalized Email Setup');
console.log('==========================================\n');

console.log(
  'This script will help you set up automated personalized idea emails.\n'
);

console.log('📋 Manual Setup Instructions:');
console.log('1. Open your terminal');
console.log('2. Run: crontab -e');
console.log('3. Add this line to run every minute:');
console.log(
  `   * * * * * curl -X POST "${SITE_URL}/api/jobs/send-personalized-ideas"\n`
);

console.log('📋 Alternative: Use a service like:');
console.log('- GitHub Actions (for free)');
console.log('- Vercel Cron Jobs');
console.log('- Railway Cron Jobs');
console.log('- Heroku Scheduler\n');

console.log('📋 For GitHub Actions, create .github/workflows/send-ideas.yml:');
console.log(`
name: Send Personalized Ideas
on:
  schedule:
    - cron: '* * * * *'  # Every minute
  workflow_dispatch:  # Manual trigger

jobs:
  send-ideas:
    runs-on: ubuntu-latest
    steps:
      - name: Send Ideas
        run: |
          curl -X POST "${SITE_URL}/api/jobs/send-personalized-ideas"
`);

console.log('📋 For Vercel Cron Jobs:');
console.log('1. Add to vercel.json:');
console.log(`
{
  "crons": [
    {
      "path": "/api/jobs/send-personalized-ideas",
      "schedule": "* * * * *"
    }
  ]
}
`);

console.log('\n✅ Setup complete! Choose your preferred method above.\n');

console.log('🔧 Testing:');
console.log(
  `- Manual test: curl -X POST "${SITE_URL}/api/jobs/send-personalized-ideas"`
);
console.log(`- Admin panel: ${SITE_URL}/admin`);
console.log('- Check logs for delivery status\n');

console.log('⚠️  Important Notes:');
console.log('- This will send emails every minute to ALL active subscribers');
console.log('- Make sure you have proper email limits configured');
console.log('- Test with a small group first');
console.log('- Monitor your email service usage\n');
