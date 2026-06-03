"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const MartyScene = dynamic(
  () =>
    import("@/features/scene/components/MartyScene").then(
      (mod) => mod.MartyScene,
    ),
  { ssr: false, loading: () => <ScenePlaceholder /> },
);

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Mini Marty
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        A virtual programming environment to learn coding with Marty the Robot
      </p>

      <div className="mt-6 h-80 w-full max-w-2xl" data-testid="scene-container">
        <MartyScene />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickAction
          title="Block Editor"
          description="Drag and drop blocks to create programs"
          href="/block-editor"
          icon="\uD83E\uDDE9"
        />
        <QuickAction
          title="Python Editor"
          description="Write Python code and see Marty move"
          href="/python-editor"
          icon="\uD83D\uDC0D"
        />
        <QuickAction
          title="Tutorials"
          description="Learn step by step with guided lessons"
          href="/tutorials"
          icon="\uD83D\uDCDA"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickAction
          title="Challenges"
          description="Test your skills with puzzles"
          href="/challenges"
          icon="\uD83C\uDFC6"
        />
        <QuickAction
          title="API Reference"
          description="All commands Marty understands"
          href="/tutorials#api"
          icon="\uD83D\uDCD6"
        />
      </div>
    </div>
  );
}

function ScenePlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
      data-testid="scene-placeholder"
    >
      <p className="text-sm text-gray-400">Loading 3D scene...</p>
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  icon,
}: {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-gray-200 p-4 text-center transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-500"
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <h2 className="mt-2 font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </Link>
  );
}
