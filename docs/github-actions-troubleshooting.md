# GitHub Actions Troubleshooting Guide

This guide helps you resolve common issues with the GitHub Actions workflows for the Reddit Ideas SaaS application.

## 🚨 Common Errors and Solutions

### 1. Missing Environment Variables Error

**Error:**
```
Error: Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.
```

**Solution:**
This error occurs when required environment variables are not set as GitHub Secrets.

#### Step 1: Check Required Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Ensure these secrets are configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `NEXT_PUBLIC_SITE_URL`

#### Step 2: Verify Secret Values
Make sure each secret has a valid value:
- **OPENAI_API_KEY**: Should start with `sk-`
- **RESEND_API_KEY**: Should start with `re_`
- **SUPABASE_SERVICE_ROLE_KEY**: Should be a long JWT token
- **EMAIL_FROM**: Should be a verified email address in Resend

### 2. API Endpoint Not Accessible

**Error:**
```
❌ API endpoint is not accessible. Please ensure your application is deployed and running.
```

**Solution:**
1. **Deploy your application** to a hosting platform (Vercel, Netlify, etc.)
2. **Update NEXT_PUBLIC_SITE_URL** secret with your deployed URL
3. **Test the endpoint** manually:
   ```bash
   curl -X POST "https://your-app.vercel.app/api/jobs/generate-ideas"
   ```

### 3. Build Failures

**Error:**
```
Build error occurred
[Error: Failed to collect page data for /api/generate-ideas]
```

**Solution:**
The workflows now skip the build step and directly call the API endpoints. This prevents build-time environment variable issues.

## 🔧 Workflow Improvements

### Updated Features:
1. **Secret Validation**: Workflows now check for required secrets before running
2. **Endpoint Testing**: Verifies API endpoints are accessible before making requests
3. **Better Error Messages**: More descriptive error messages for troubleshooting
4. **Node.js 20**: Updated to use Node.js 20 for better compatibility

### Workflow Structure:
```yaml
- Checkout code
- Setup Node.js 20
- Install dependencies
- Check required secrets ← NEW
- Run API job with endpoint validation ← IMPROVED
```

## 📋 Setup Checklist

### Before Running Workflows:

- [ ] **Deploy Application**: Ensure your app is deployed and accessible
- [ ] **Set GitHub Secrets**: All required secrets are configured
- [ ] **Verify API Keys**: Test that your API keys work locally
- [ ] **Check Endpoints**: Ensure API endpoints return 200/405 responses
- [ ] **Test Manually**: Run the API endpoints manually first

### Required GitHub Secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `RESEND_API_KEY` | Resend API key | `re_...` |
| `EMAIL_FROM` | Verified email address | `ideas@yourdomain.com` |
| `NEXT_PUBLIC_SITE_URL` | Your deployed app URL | `https://your-app.vercel.app` |

## 🧪 Testing Workflows

### Manual Testing:
1. **Test Idea Generation**:
   ```bash
   curl -X POST "https://your-app.vercel.app/api/jobs/generate-ideas"
   ```

2. **Test Email Sending**:
   ```bash
   curl -X POST "https://your-app.vercel.app/api/jobs/send-personalized-ideas"
   ```

### GitHub Actions Testing:
1. Go to Actions tab in your repository
2. Select "Generate Ideas from Reddit Posts"
3. Click "Run workflow" → "Run workflow"
4. Check the logs for any errors

## 🔍 Debugging Steps

### 1. Check Workflow Logs
- Go to Actions → Select workflow → Select run
- Look for error messages in the logs
- Check the "Check required secrets" step

### 2. Verify API Endpoints
```bash
# Test if endpoints are accessible
curl -I "https://your-app.vercel.app/api/jobs/generate-ideas"
curl -I "https://your-app.vercel.app/api/jobs/send-personalized-ideas"
```

### 3. Test Environment Variables
Create a test script to verify your environment variables:

```javascript
// test-env.js
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Missing');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Missing');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
```

## 🚀 Quick Fix Commands

### If you get environment variable errors:
1. **Check secrets**: Go to GitHub Settings → Secrets
2. **Verify values**: Make sure secrets have correct values
3. **Redeploy**: Trigger a new workflow run

### If you get API endpoint errors:
1. **Deploy app**: Make sure your app is deployed
2. **Update URL**: Set correct NEXT_PUBLIC_SITE_URL
3. **Test locally**: Run the API endpoints locally first

## 📞 Support

If you're still experiencing issues:

1. **Check the logs** in GitHub Actions
2. **Verify all secrets** are set correctly
3. **Test API endpoints** manually
4. **Ensure your app is deployed** and accessible

The workflows now provide much better error messages to help you identify and fix issues quickly!

---

## 🎯 Summary

The updated workflows now:
- ✅ **Validate secrets** before running
- ✅ **Test API endpoints** before making requests
- ✅ **Provide clear error messages** for troubleshooting
- ✅ **Skip problematic build steps** that caused environment variable issues
- ✅ **Use Node.js 20** for better compatibility

This should resolve the "Missing credentials" error you were experiencing!
