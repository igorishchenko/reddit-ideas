export default function ContactPage() {
  return (
    <main className='font-sans min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f8fafc] via-white to-white dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-black'>
      <section className='mx-auto max-w-xl px-6 py-20 sm:py-24'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          Contact
        </h1>
        <p className='mt-3 text-sm text-gray-600 dark:text-gray-300'>
          Questions, partnerships, or feedback? Send us a message.
        </p>

        <form className='mt-8 space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-xs font-medium text-gray-700 dark:text-gray-300'
            >
              Name
            </label>
            <input
              id='name'
              className='mt-1 w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white/80 dark:bg-white/[.02] px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20'
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-xs font-medium text-gray-700 dark:text-gray-300'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              className='mt-1 w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white/80 dark:bg-white/[.02] px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20'
            />
          </div>
          <div>
            <label
              htmlFor='message'
              className='block text-xs font-medium text-gray-700 dark:text-gray-300'
            >
              Message
            </label>
            <textarea
              id='message'
              rows={5}
              className='mt-1 w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white/80 dark:bg-white/[.02] px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20'
            />
          </div>
          <button
            type='submit'
            className='w-full inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
