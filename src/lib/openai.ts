import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    'Missing OPENAI_API_KEY environment variable. Please set it in your environment or GitHub Secrets.'
  );
}

const openai = new OpenAI({
  apiKey,
});

export { openai };
