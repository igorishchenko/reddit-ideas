#!/usr/bin/env node

/**
 * Test script for GitHub Actions workflows
 * This script helps test the cron job endpoints locally
 */

import https from 'https';
import http from 'http';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

console.log('🧪 GitHub Actions Workflow Testing Script');
console.log('==========================================\n');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testGenerateIdeas() {
  console.log('🚀 Testing Generate Ideas Workflow...');
  try {
    const result = await makeRequest(`${SITE_URL}/api/jobs/generate-ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (result.data.success) {
      console.log('✅ Generate Ideas: SUCCESS');
      console.log(`   Ideas generated: ${result.data.ideasGenerated || 'N/A'}`);
      console.log(`   Posts processed: ${result.data.postsProcessed || 'N/A'}`);
    } else {
      console.log('❌ Generate Ideas: FAILED');
      console.log(`   Error: ${result.data.error || 'Unknown error'}`);
    }

    return result.data;
  } catch (error) {
    console.error('❌ Generate Ideas: ERROR');
    console.error(`   ${error.message}`);
    return null;
  }
}

async function testSendPersonalizedEmails() {
  console.log('\n📧 Testing Send Personalized Emails Workflow...');
  try {
    const result = await makeRequest(
      `${SITE_URL}/api/jobs/send-personalized-ideas`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (result.data.success) {
      console.log('✅ Send Personalized Emails: SUCCESS');
      console.log(`   Emails sent: ${result.data.sent || 0}`);
      if (result.data.errors && result.data.errors.length > 0) {
        console.log(`   Errors: ${result.data.errors.length}`);
        result.data.errors.slice(0, 3).forEach((error) => {
          console.log(`   - ${error}`);
        });
      }
    } else {
      console.log('❌ Send Personalized Emails: FAILED');
      console.log(`   Error: ${result.data.error || 'Unknown error'}`);
    }

    return result.data;
  } catch (error) {
    console.error('❌ Send Personalized Emails: ERROR');
    console.error(`   ${error.message}`);
    return null;
  }
}

async function testJobStatus() {
  console.log('\n📊 Testing Job Status...');
  try {
    const result = await makeRequest(`${SITE_URL}/api/jobs/status`);

    if (result.data.success) {
      console.log('✅ Job Status: SUCCESS');
      console.log(`   Total ideas: ${result.data.data.ideas.total}`);
      console.log(`   Total posts: ${result.data.data.posts.total}`);
      console.log(`   Processed posts: ${result.data.data.posts.processed}`);
    } else {
      console.log('❌ Job Status: FAILED');
      console.log(`   Error: ${result.data.error || 'Unknown error'}`);
    }

    return result.data;
  } catch (error) {
    console.error('❌ Job Status: ERROR');
    console.error(`   ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Starting workflow tests...\n');

  // Test 1: Generate Ideas
  const generateResult = await testGenerateIdeas();

  // Test 2: Send Personalized Emails
  const emailResult = await testSendPersonalizedEmails();

  // Test 3: Check Status
  const statusResult = await testJobStatus();

  console.log('\n📋 Summary:');
  console.log('===========');
  console.log(
    `Generate Ideas: ${generateResult?.success ? '✅ PASS' : '❌ FAIL'}`
  );
  console.log(`Send Emails: ${emailResult?.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Job Status: ${statusResult?.success ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n🔧 GitHub Actions Setup:');
  console.log('========================');
  console.log('1. Add secrets to your GitHub repository:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  console.log('   - OPENAI_API_KEY');
  console.log('   - RESEND_API_KEY');
  console.log('   - EMAIL_FROM');
  console.log('   - NEXT_PUBLIC_SITE_URL');
  console.log('\n2. Enable workflows in GitHub Actions tab');
  console.log('\n3. Test with manual triggers first');
  console.log('\n4. Monitor execution logs');

  console.log('\n📚 Documentation:');
  console.log('=================');
  console.log(
    'See docs/github-actions-setup.md for detailed setup instructions'
  );
}

main().catch(console.error);
