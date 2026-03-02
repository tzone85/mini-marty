export default function TutorialsPage() {
  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Tutorials
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Follow step-by-step lessons to learn programming with Marty.
      </p>
      <div className="mt-6 flex-1 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400 dark:border-gray-600 dark:text-gray-500">
        Tutorial content will be rendered here
      </div>
    </div>
  );
}
