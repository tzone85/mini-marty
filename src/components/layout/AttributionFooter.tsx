"use client";

/**
 * Persistent footer that points users to the real Marty experience.
 * Required by the project's IP / trademark posture — see docs/ATTRIBUTION.md.
 */
export function AttributionFooter() {
  return (
    <footer
      className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-center text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
      data-testid="attribution-footer"
    >
      <span>
        Mini Marty is a fan-made educational re-implementation. For the real
        Marty robot, visit{" "}
        <a
          href="https://codemarty.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          codemarty.com
        </a>
        {" · "}
        <a
          href="https://robotical.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          robotical.io
        </a>
        {". Marty™ is a trademark of Robotical Ltd. Not affiliated."}
      </span>
    </footer>
  );
}
