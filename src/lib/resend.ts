import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error(
    'Missing RESEND_API_KEY environment variable. Please set it in your environment or GitHub Secrets.'
  );
}

const resend = new Resend(apiKey);

export { resend };
