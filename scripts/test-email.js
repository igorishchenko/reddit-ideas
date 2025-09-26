#!/usr/bin/env node

/**
 * Test script for debugging email sending issues
 * This script helps test the personalized email system
 */

import https from 'https';
import http from 'http';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

console.log('🧪 Reddit Ideas - Email Testing Script');
console.log('=====================================\n');

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

async function testPersonalizedEmail() {
  console.log('\n📧 Testing personalized email sending...');
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
    console.log(
      'Personalized email response:',
      JSON.stringify(result.data, null, 2)
    );
    return result.data;
  } catch (error) {
    console.error('❌ Personalized email failed:', error.message);
    return null;
  }
}

async function main() {
  console.log('Starting email system tests...\n');

  // Test: Try sending emails
  const emailResult = await testPersonalizedEmail();

  if (emailResult && emailResult.success) {
    console.log(`\n✅ Email job completed: ${emailResult.message}`);
    console.log(`   Emails sent: ${emailResult.sent}`);
    if (emailResult.errors && emailResult.errors.length > 0) {
      console.log(`   Errors: ${emailResult.errors.length}`);
      emailResult.errors.forEach((error) => console.log(`   - ${error}`));
    }
  }

  console.log('\n🔧 Troubleshooting Tips:');
  console.log('1. Check your Resend API key in .env.local');
  console.log('2. Verify EMAIL_FROM domain is configured in Resend');
  console.log('3. Check server logs for detailed error messages');
  console.log('4. Test with a small number of subscriptions first');
  console.log('5. Verify ideas exist in the database');

  console.log('\n📋 Next Steps:');
  console.log('1. Go to /admin and click "Send Personalized Ideas"');
  console.log('2. If no subscriptions, go to /subscribe and create one');
  console.log('3. If no ideas, run "Run Idea Generation Job" first');
  console.log('4. Check server logs for detailed information');
}

main().catch(console.error);
