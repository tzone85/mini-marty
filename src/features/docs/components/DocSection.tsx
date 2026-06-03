"use client";

import type { DocSection as DocSectionType } from "../types";
import { CodeExample } from "./CodeExample";

interface DocSectionProps {
  readonly section: DocSectionType;
}

export function DocSection({ section }: DocSectionProps) {
  return (
    <div data-testid={`doc-section-${section.id}`}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {section.title}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {section.description}
      </p>

      <div className="mt-6 space-y-8">
        {section.subsections.map((subsection) => (
          <div key={subsection.id} id={subsection.id}>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {subsection.title}
            </h2>
            <div className="mt-3 space-y-6">
              {subsection.entries.map((entry) => (
                <div
                  key={entry.title}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {entry.description}
                  </p>

                  <div className="mt-3 space-y-2">
                    {entry.content.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {entry.parameters && entry.parameters.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Parameters
                      </h4>
                      <div className="mt-1 space-y-1">
                        {entry.parameters.map((param) => (
                          <div
                            key={param.name}
                            className="flex items-baseline gap-2 text-sm"
                          >
                            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-gray-800 dark:text-blue-400">
                              {param.name}
                            </code>
                            <span className="text-xs text-gray-400">
                              ({param.type})
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {param.description}
                            </span>
                            {param.defaultValue && (
                              <span className="text-xs text-gray-400">
                                Default: {param.defaultValue}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.returns && (
                    <div className="mt-2 text-sm">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Returns:{" "}
                      </span>
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-gray-800 dark:text-green-400">
                        {entry.returns}
                      </code>
                    </div>
                  )}

                  {entry.examples?.map((example) => (
                    <CodeExample key={example.title} example={example} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
