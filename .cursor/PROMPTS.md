1. Scaffold Next.js TypeScript app with Tailwind in the project root
   Output:
   Created Next.js project in the root with all needed files to start dev

2. Install core deps: Supabase, auth helpers, OpenAI, Resend, Zod
   Output:
   Added and installed all deps

3.I need landing page with next requirements:

- one page with product descirption
- Need similar design like: Tosnos SaaS Landing (Dribbble) — do not copy
- next blocks should be presented:
  -- Hero block
  -- value proposition
  -- "Get Started" CTA
  Output:
  Created landing page according to the Tosnos SaaS design
  Created all required blocks
  Created additional pages like (signup, pricing, how-it-works, etc.)

  4.Implement auth (register/login/logout) via Supabase
  Use existing page from context
  After login / successful registration - redirect to the `/recommendations-feed` page
  After logout - redirect user to `/` page
  Output:
  Created login, logout pages, added logic for registration and login

  5. Implement ideas feed UI with filters and badges
     Use page from the context to implement it there
     Recommendations feed: A list of fresh product ideas with filters by topic (e.g., devtools, health, education, etc.). Fields:

- Idea name
- Short pitch (1–2 sentences)
- Key pain point/insight
- Sources (subreddit/link)
- Score (0–100)
- “New” badge
  Output:
  Updated recommendations-feed with new feature
  Search, score filter, topic filter
  Created UI for the product ideas card
