## Reddit Ideas – MVP SaaS

A minimal SaaS that tracks problem-centric subreddits, extracts signals, generates product ideas, and scores viability.

### Tech

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Auth)
- OpenAI (LLM)
- Resend (emails)

### Quick Start

1. Clone the repo and install deps:
   - `npm install`
2. Create `.env.local` from `env.example` and set keys:
   - `cp env.example .env.local`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`, `EMAIL_FROM`
3. Run dev server:
   - `npm run dev`

### Supabase

- Create a new Supabase project and get URL + anon key.
- Auth: Enable Email/Password.

Optional tables (SQL) if you choose to persist ideas/subscriptions:

```sql
-- or run web/supabase.sql
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  topic text,
  name text not null,
  pitch text not null,
  pain text,
  sources jsonb,
  score int
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  email text not null unique,
  topics text[] default '{}',
  unsub_token text unique
);
```

### Email

- Add `RESEND_API_KEY` and `EMAIL_FROM` in env.
- For local testing, endpoints exist but real sending is optional.

### LLM

- Put `OPENAI_API_KEY`. Model defaults to `gpt-4o-mini`.
- Prompts are in `PROMPTS.md` and `src/lib/llm/prompts.ts`.

### Structure

- `src/app` – routes (pages + API)
- `src/components` – UI components
- `src/lib` – clients, utils, LLM, validation
- `data` – mock Reddit snapshot

### Cursor Artifacts

- `.cursor/rules.md` – contribution rules
- `PROMPTS.md` – key prompts

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
