"use client";

import { useState } from "react";
import { TUTORIALS } from "@/features/tutorials/tutorial-data";
import type { Tutorial } from "@/features/tutorials/tutorial-data";

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function TutorialsPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState(0);

  if (selectedTutorial) {
    const step = selectedTutorial.steps[currentStep];
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={() => {
              setSelectedTutorial(null);
              setCurrentStep(0);
            }}
            className="mb-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Tutorials
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedTutorial.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep + 1} of {selectedTutorial.steps.length}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step.title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {step.description}
          </p>

          {step.hint && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Hint:</strong> {step.hint}
              </p>
            </div>
          )}

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Code:
            </h3>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-300">
              <code>{step.code}</code>
            </pre>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Copy this code into the Python Editor to try it out!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 dark:border-gray-700">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {selectedTutorial.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentStep
                    ? "bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentStep((s) =>
                Math.min(selectedTutorial.steps.length - 1, s + 1),
              )
            }
            disabled={currentStep === selectedTutorial.steps.length - 1}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Tutorials
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Follow step-by-step lessons to learn programming with Marty. Start with
        the basics and work your way up!
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TUTORIALS.map((tutorial) => (
          <button
            key={tutorial.id}
            onClick={() => setSelectedTutorial(tutorial)}
            className="rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-500"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {tutorial.title}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[tutorial.difficulty]}`}
              >
                {tutorial.difficulty}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {tutorial.description}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <span>{tutorial.steps.length} steps</span>
              <span>~{tutorial.estimatedMinutes} min</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8" id="api">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          API Quick Reference
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {API_REFERENCE.map((item) => (
              <div
                key={item.command}
                className="flex items-start gap-4 px-4 py-3"
              >
                <code className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-sm font-mono text-blue-700 dark:bg-gray-800 dark:text-blue-400">
                  {item.command}
                </code>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const API_REFERENCE = [
  { command: "walk(steps)", description: "Walk forward for N steps" },
  { command: "dance()", description: "Perform a dance routine" },
  {
    command: 'kick("left"/"right")',
    description: "Kick with the specified leg",
  },
  {
    command: 'slide("left"/"right")',
    description: "Slide sideways in a direction",
  },
  {
    command: 'lean("left"/"right")',
    description: "Lean in the specified direction",
  },
  { command: "wiggle()", description: "Wiggle Marty's body" },
  { command: "circle_dance()", description: "Perform a circular dance" },
  { command: "celebrate()", description: "Celebrate with arms up!" },
  { command: "get_ready()", description: "Move to the ready position" },
  { command: "stand_straight()", description: "Stand upright" },
  {
    command: 'eyes("normal"/"wide"/"angry"/"excited")',
    description: "Set eye expression",
  },
  {
    command: "arms(left, right)",
    description: "Set arm angles (-100 to 100)",
  },
  {
    command: 'foot_on_ground("left"/"right")',
    description: "Check if foot is touching ground",
  },
  {
    command: "get_distance_sensor()",
    description: "Get distance reading in cm",
  },
  {
    command: "get_accelerometer()",
    description: "Get accelerometer {x, y, z} data",
  },
  { command: "stop()", description: "Stop all current actions" },
  { command: "is_moving()", description: "Check if Marty is moving" },
  {
    command: 'play_sound("excited"/"confused")',
    description: "Play a sound effect",
  },
];
