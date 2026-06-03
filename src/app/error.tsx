"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div role="alert" className="p-8 text-center">
      <h1 className="text-2xl font-bold">Something went wrong on this page</h1>
      <p
        className="mt-2 text-gray-600 dark:text-gray-300"
        data-error-message={error.message}
      >
        We hit an unexpected problem. Try again, or head back to the home page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Try again
      </button>
    </div>
  );
}
