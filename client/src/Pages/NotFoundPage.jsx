import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
          Error 404
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-6xl">
          Page not found
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have
          moved or the address might be incorrect.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
