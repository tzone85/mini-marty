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
        Visual programming environment for the Marty robot
      </p>

      <div className="mt-6 h-80 w-full max-w-2xl" data-testid="scene-container">
        <MartyScene />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickAction title="Block Editor" description="Drag and drop blocks" />
        <QuickAction title="Python Editor" description="Write Python code" />
        <QuickAction title="Tutorials" description="Learn step by step" />
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
}: {
  readonly title: string;
  readonly description: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
      <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
