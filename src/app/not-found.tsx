import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2">We could not find what you were looking for.</p>
      <Link
        href="/"
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Back home
      </Link>
    </div>
  );
}
