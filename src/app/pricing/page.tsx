import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
      <section className='mx-auto max-w-6xl px-6 py-20 sm:py-24'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          Pricing
        </h1>
        <p className='mt-4 text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
          Start free. Upgrade when you need deeper insights and automation.
        </p>

        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              Free
            </div>
            <div className='mt-1 text-3xl font-bold text-gray-900 dark:text-white'>
              $0
            </div>
            <ul className='mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300'>
              <li>Weekly trending subreddits</li>
              <li>Basic insight summaries</li>
              <li>Save up to 5 ideas</li>
            </ul>
            <Link
              href='/signup'
              className='mt-6 inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
            >
              Get started
            </Link>
          </div>

          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white p-6 shadow-sm ring-1 ring-black/[.06] dark:bg-white/[.04]'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              Pro
            </div>
            <div className='mt-1 text-3xl font-bold text-gray-900 dark:text-white'>
              $19
            </div>
            <ul className='mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300'>
              <li>Daily subreddit discovery</li>
              <li>Advanced clustering and themes</li>
              <li>Idea viability scoring</li>
              <li>Unlimited idea saves</li>
            </ul>
            <Link
              href='/signup'
              className='mt-6 inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
            >
              Start Pro
            </Link>
          </div>

          <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/70 dark:bg-white/[.02] p-6 backdrop-blur'>
            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
              Team
            </div>
            <div className='mt-1 text-3xl font-bold text-gray-900 dark:text-white'>
              $49
            </div>
            <ul className='mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300'>
              <li>All Pro features</li>
              <li>Team workspaces</li>
              <li>Email reports and webhooks</li>
            </ul>
            <Link
              href='/contact'
              className='mt-6 inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
