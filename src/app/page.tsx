import Link from 'next/link';

export default function Home() {
  return (
    <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[conic-gradient(at_50%_-20%,#60a5fa_0deg,#a78bfa_120deg,#f472b6_240deg,#60a5fa_360deg)] opacity-10 blur-3xl' />
        <div className='mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32'>
          <div className='text-center'>
            <p className='inline-flex items-center rounded-full bg-black/[.04] dark:bg-white/[.06] px-3 py-1 text-xs/5 font-medium text-black/70 dark:text-white/80 ring-1 ring-black/[.06] dark:ring-white/[.08]'>
              New • Generate SaaS ideas from Reddit signals
            </p>
            <h1 className='mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl'>
              SaaS Generator of Product Ideas from Reddit
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg'>
              Track emerging Reddit discussions where people share problems. We
              surface opportunities and generate product ideas with a viability
              score, so you can start building faster.
            </p>
            <div className='mt-10 flex items-center justify-center gap-4'>
              <Link
                href='/signup'
                className='inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100'
              >
                Get Started
              </Link>
              <Link
                href='/how-it-works'
                className='inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section
        id='learn-more'
        className='mx-auto max-w-7xl px-6 py-16 sm:py-20'
      >
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              Trending Subreddits
            </div>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
              We monitor rising communities where users actively discuss pains
              and requests.
            </p>
          </div>
          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              Insight Extraction
            </div>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
              Cluster problems, summarize themes, and highlight underserved
              segments.
            </p>
          </div>
          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              Idea Generation + Score
            </div>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
              Turn insights into product ideas with a viability score based on
              demand, competition, and feasibility.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id='get-started'
        className='mx-auto max-w-7xl px-6 pb-24 sm:pb-28 lg:pb-32'
      >
        <div className='rounded-3xl bg-gray-900 text-white dark:bg-white dark:text-black p-8 sm:p-12 flex flex-col items-start gap-6'>
          <h2 className='text-2xl font-bold sm:text-3xl'>
            Validate faster with real user problems
          </h2>
          <p className='text-sm/6 opacity-90 max-w-2xl'>
            Connect your Reddit API keys later. Start by exploring current
            opportunities and save the best ideas to your shortlist.
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link
              href='/signup'
              className='inline-flex items-center justify-center rounded-full bg-white text-gray-900 px-5 py-2.5 text-sm font-semibold hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-black/90'
            >
              Create free account
            </Link>
            <Link
              href='/pricing'
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 dark:border-black/20 dark:hover:bg-black/5'
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
