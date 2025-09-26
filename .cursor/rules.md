Title: Cursor AI Rules for Reddit Ideas SaaS

Scope

- This project is a Next.js (App Router) + TypeScript app with Supabase, OpenAI, and Resend.

Architecture & Conventions

- Keep business logic in `src/lib/*` and server routes in `src/app/api/*`.
- Use Zod for input/output validation at API boundaries.
- Use server actions or route handlers for mutations; avoid client secrets on the client.
- Use meaningful names; avoid abbreviations. Prefer explicit types for exported APIs.
- Error-first: validate inputs, handle edge cases with clear messages.
- Keep UI components in `src/components/*` and route UIs in `src/app/*`.
- Do not introduce unrelated dependencies.

Git / Commits

- Conventional commits: feat, fix, docs, chore, refactor, style, test.
- Small, focused commits per feature or fix.

Styling

- Tailwind for styling; keep component styles co-located.
- Prefer semantic HTML; accessible forms and buttons.

Secrets & Config

- All secrets from environment variables only. Never hardcode keys.
- Add sample env keys in `.env.local`.

LLM Usage

- All prompts/configs in `src/lib/prompts.ts`.
- Define Zod schemas for model outputs and parse/validate.
- Avoid long context; keep inputs succinct and structured.

Testing & Quality

- Run `npm run build` before pushing.
- Fix linter/type errors before commit.

Editor Rules

- Preserve existing indentation and formatting.
