# GitHub Actions Setup Guide

This guide explains how to set up automated cron jobs using GitHub Actions for the Reddit Ideas SaaS application.

## 🚀 Overview

Two automated workflows are configured:

1. **Generate Ideas** - Runs every hour to process Reddit posts and generate product ideas
2. **Send Personalized Emails** - Runs every minute to send personalized ideas to subscribers

## 📋 Required GitHub Secrets

Before the workflows can run, you need to configure the following secrets in your GitHub repository:

### 1. Go to Repository Settings

- Navigate to your GitHub repository
- Click on **Settings** tab
- Click on **Secrets and variables** → **Actions**

### 2. Add Required Secrets

Click **New repository secret** for each of the following:

| Secret Name                 | Description                                             | Example                                   |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | Your Supabase project URL                               | `https://your-project.supabase.co`        |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (bypasses RLS)                | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `OPENAI_API_KEY`            | OpenAI API key for LLM processing                       | `sk-...`                                  |
| `RESEND_API_KEY`            | Resend API key for sending emails                       | `re_...`                                  |
| `EMAIL_FROM`                | Email address to send from (must be verified in Resend) | `ideas@yourdomain.com`                    |
| `NEXT_PUBLIC_SITE_URL`      | Your deployed application URL                           | `https://your-app.vercel.app`             |

## 🔧 Workflow Details

### Generate Ideas Workflow (`generate-ideas.yml`)

**Schedule:** Every hour at minute 0 (`0 * * * *`)

**What it does:**

1. Fetches mock Reddit posts
2. Processes them through OpenAI LLM
3. Generates product ideas with scores
4. Stores everything in Supabase database

**Manual trigger:** Available in GitHub Actions tab

### Send Personalized Emails Workflow (`send-personalized-emails.yml`)

**Schedule:** Every minute (`* * * * *`)

**What it does:**

1. Fetches active email subscriptions
2. Filters ideas by user topics
3. Sends personalized emails via Resend
4. Logs delivery status

**Manual trigger:** Available in GitHub Actions tab

## 🚀 Deployment Steps

### 1. Deploy Your Application

Make sure your Next.js app is deployed and accessible via `NEXT_PUBLIC_SITE_URL`.

### 2. Configure Secrets

Add all required secrets to your GitHub repository.

### 3. Enable Workflows

- Go to **Actions** tab in your repository
- You should see both workflows listed
- Click on each workflow and click **Enable workflow**

### 4. Test Manual Execution

- Click on **Generate Ideas** workflow
- Click **Run workflow** → **Run workflow**
- Check the logs to ensure it's working

- Click on **Send Personalized Emails** workflow
- Click **Run workflow** → **Run workflow**
- Check the logs to ensure it's working

## 📊 Monitoring

### View Workflow Runs

- Go to **Actions** tab
- Click on individual workflows to see run history
- Click on specific runs to see detailed logs

### Check Application Logs

- Monitor your deployed application logs
- Check Supabase logs for database operations
- Check Resend dashboard for email delivery status

## ⚙️ Customization

### Change Schedule

Edit the `cron` expressions in the workflow files:

```yaml
schedule:
  - cron: '0 * * * *' # Every hour
  - cron: '0 0 * * *' # Daily at midnight
  - cron: '0 0 * * 0' # Weekly on Sunday
```

### Add Notifications

You can add Slack/Discord notifications on failure:

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔍 Troubleshooting

### Common Issues

1. **Workflow not running**

   - Check if workflows are enabled
   - Verify all secrets are configured
   - Check GitHub Actions usage limits

2. **API calls failing**

   - Verify `NEXT_PUBLIC_SITE_URL` is correct
   - Check if your app is deployed and accessible
   - Verify API endpoints are working

3. **Database errors**

   - Check Supabase connection
   - Verify service role key has proper permissions
   - Check RLS policies

4. **Email sending failures**
   - Verify Resend API key
   - Check EMAIL_FROM domain is verified
   - Check Resend usage limits

### Debug Steps

1. **Check workflow logs**

   - Go to Actions → Select workflow → Select run
   - Review step-by-step execution logs

2. **Test endpoints manually**

   ```bash
   curl -X POST "https://your-app.vercel.app/api/jobs/generate-ideas"
   curl -X POST "https://your-app.vercel.app/api/jobs/send-personalized-ideas"
   ```

3. **Verify secrets**
   - Double-check all secrets are correctly set
   - Ensure no extra spaces or characters

## 📈 Scaling Considerations

### Rate Limits

- **GitHub Actions:** 2,000 minutes/month for free accounts
- **OpenAI API:** Check your usage limits
- **Resend:** Check your email sending limits

### Cost Optimization

- Adjust cron frequency based on needs
- Monitor usage and optimize accordingly
- Consider upgrading GitHub plan if needed

## 🎯 Next Steps

1. **Monitor Performance**

   - Track workflow execution times
   - Monitor API usage and costs
   - Check email delivery rates

2. **Add Monitoring**

   - Set up alerts for workflow failures
   - Monitor application health
   - Track user engagement

3. **Optimize**
   - Fine-tune cron schedules
   - Optimize API calls
   - Improve error handling

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions documentation
3. Check your application logs
4. Verify all configurations are correct
