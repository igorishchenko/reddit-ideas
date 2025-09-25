import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
      <section className='mx-auto max-w-4xl px-6 py-20 sm:py-24'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          How it works
        </h1>
        <p className='mt-4 text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
          We turn Reddit discussions into actionable product ideas with a simple
          workflow.
        </p>

        <ol className='mt-10 space-y-6'>
          <li className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              1) Discover trending subreddits
            </div>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
              We track growth signals and engagement to surface communities
              where users discuss real problems.
            </p>
          </li>
          <li className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              2) Extract and cluster insights
            </div>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
              Posts and comments are summarized and clustered into clear themes
              and underserved segments.
            </p>
          </li>
          <li className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              3) Generate ideas with a viability score
            </div>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
              For each theme we propose SaaS ideas and score them by demand,
              competition, and feasibility.
            </p>
          </li>
        </ol>

        <div className='mt-10 flex gap-3'>
          <Link
            href='/signup'
            className='inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
          >
            Get started free
          </Link>
          <Link
            href='/pricing'
            className='inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
          >
            See pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
