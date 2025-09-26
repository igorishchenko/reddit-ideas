# Cron Job Schedules

## 📅 Current Schedules

### 1. Generate Ideas Workflow

- **File:** `.github/workflows/generate-ideas.yml`
- **Schedule:** `0 * * * *` (Every hour at minute 0)
- **Purpose:** Fetch Reddit posts, process via LLM, store ideas in database
- **Manual Trigger:** Available

### 2. Send Personalized Emails Workflow

- **File:** `.github/workflows/send-personalized-emails.yml`
- **Schedule:** `* * * * *` (Every minute)
- **Purpose:** Send personalized idea emails to subscribed users
- **Manual Trigger:** Available

## 🕐 Cron Expression Reference

| Expression    | Description  | Example                  |
| ------------- | ------------ | ------------------------ |
| `* * * * *`   | Every minute | Every minute             |
| `0 * * * *`   | Every hour   | Every hour at minute 0   |
| `0 0 * * *`   | Daily        | Every day at midnight    |
| `0 0 * * 0`   | Weekly       | Every Sunday at midnight |
| `0 0 1 * *`   | Monthly      | First day of every month |
| `0 9 * * 1-5` | Weekdays     | 9 AM on weekdays only    |

## ⚙️ Customization Examples

### Less Frequent Idea Generation

```yaml
schedule:
  - cron: '0 */2 * * *' # Every 2 hours
  - cron: '0 0 * * *' # Daily at midnight
  - cron: '0 0 * * 0' # Weekly on Sunday
```

### Less Frequent Email Sending

```yaml
schedule:
  - cron: '*/5 * * * *' # Every 5 minutes
  - cron: '0 * * * *' # Every hour
  - cron: '0 9 * * *' # Daily at 9 AM
```

### Business Hours Only

```yaml
schedule:
  - cron: '0 9-17 * * 1-5' # Every hour, 9 AM to 5 PM, weekdays only
```

## 📊 Monitoring Recommendations

### For High Volume

- **Ideas Generation:** Every 2-4 hours
- **Email Sending:** Every 5-15 minutes

### For Low Volume

- **Ideas Generation:** Daily
- **Email Sending:** Hourly or daily

### For Testing

- **Ideas Generation:** Manual trigger only
- **Email Sending:** Manual trigger only

## 🚨 Important Notes

1. **GitHub Actions Limits**

   - Free accounts: 2,000 minutes/month
   - Every minute = 1,440 minutes/day
   - Monitor usage in GitHub Settings

2. **API Rate Limits**

   - OpenAI API: Check your tier limits
   - Resend: Check email sending limits
   - Supabase: Check database operation limits

3. **Cost Considerations**
   - More frequent = higher costs
   - Monitor usage and optimize accordingly
   - Consider upgrading plans if needed

## 🔧 Quick Changes

To modify schedules, edit the `cron` expressions in:

- `.github/workflows/generate-ideas.yml`
- `.github/workflows/send-personalized-emails.yml`

Then commit and push to activate the new schedules.
