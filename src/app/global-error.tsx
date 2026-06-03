"use client";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div role="alert" className="p-8 text-center">
          <h1 className="text-2xl font-bold">Mini Marty had a problem</h1>
          <p className="mt-2" data-error-message={error.message}>
            Something unexpected happened. Reload to try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
