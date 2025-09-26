import UnsubscribeContent from '@/components/UnsubscribeContent';
import { Suspense } from 'react';

function LoadingFallback() {
  return (
    <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
      <section className='mx-auto max-w-2xl px-6 py-20 sm:py-24'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Unsubscribe
          </h1>
          <p className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
            We're sorry to see you go. You can resubscribe anytime.
          </p>
        </div>

        <div className='rounded-2xl border border-black/[.06] dark:border-white/[.08] bg-white/80 dark:bg-white/[.02] p-8 backdrop-blur'>
          <div className='text-center py-8'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <p className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
              Loading...
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UnsubscribeContent />
    </Suspense>
  );
}
