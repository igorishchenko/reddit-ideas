export const IDEA_GENERATION_PROMPT = `You are a product strategist analyzing Reddit discussions to generate SaaS product ideas. 

Given a Reddit post, extract the core problem and generate a product idea with scoring.

Reddit Post:
Title: {title}
Subreddit: r/{subreddit}
Upvotes: {upvotes}
Comments: {numComments}

Instructions:
1. Identify the core problem/pain point
2. Generate a specific SaaS product idea that solves this problem
3. Score the idea on multiple dimensions (0-100 each)
4. Return ONLY a valid JSON object with this exact structure:

{
  "name": "Product name (max 50 chars)",
  "pitch": "One-sentence elevator pitch (max 120 chars)",
  "painPoint": "Core problem statement (max 200 chars)",
  "targetAudience": "Who would use this (max 100 chars)",
  "scores": {
    "painLevel": 85,
    "willingnessToPay": 70,
    "competition": 30,
    "tam": 60,
    "feasibility": 80
  },
  "topic": "devtools|health|education|finance|productivity|other"
}

Scoring guidelines:
- painLevel: How severe is the problem? (0-100)
- willingnessToPay: How likely are users to pay? (0-100)
- competition: How crowded is the market? (0-100, lower = less competition)
- tam: Total addressable market size (0-100)
- feasibility: How easy to build? (0-100)

Focus on actionable, specific SaaS ideas that solve real problems.`;

export function formatPrompt(
  title: string,
  subreddit: string,
  upvotes: number,
  numComments: number
): string {
  return IDEA_GENERATION_PROMPT.replace('{title}', title)
    .replace('{subreddit}', subreddit)
    .replace('{upvotes}', upvotes.toString())
    .replace('{numComments}', numComments.toString());
}
