export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <h1 className="text-4xl font-bold">Welcome to Mini Marty</h1>
      <p className="max-w-md text-center text-lg text-gray-600 dark:text-gray-400">
        Learn to code with Marty the robot using block-based or Python
        programming.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href="/block-editor"
          className="rounded-lg border border-gray-200 p-6 text-center hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
        >
          <h2 className="text-xl font-semibold">Block Editor</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Drag-and-drop coding with visual blocks
          </p>
        </a>
        <a
          href="/python-editor"
          className="rounded-lg border border-gray-200 p-6 text-center hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
        >
          <h2 className="text-xl font-semibold">Python Editor</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Write Python code to control Marty
          </p>
        </a>
        <a
          href="/tutorials"
          className="rounded-lg border border-gray-200 p-6 text-center hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
        >
          <h2 className="text-xl font-semibold">Tutorials</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Step-by-step lessons to get started
          </p>
        </a>
        <a
          href="/challenges"
          className="rounded-lg border border-gray-200 p-6 text-center hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
        >
          <h2 className="text-xl font-semibold">Challenges</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Test your skills with coding puzzles
          </p>
        </a>
      </div>
    </div>
  );
}
