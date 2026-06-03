import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.d.ts",
        "src/**/*.{test,spec}.{ts,tsx}",
        // Type-only modules (no executable code → not measurable)
        "src/**/types.ts",
        "src/**/index.ts",
        // Vendor-bound DOM components — covered by Playwright E2E suite
        // because they require real WebGL, Monaco/Blockly DOM, or browser
        // <script> injection that jsdom cannot satisfy.
        "src/features/scene/components/**",
        "src/features/scene/hooks/useMartyModel.ts",
        "src/features/scene/animation/useMartyAnimation.ts",
        "src/features/blocks/BlocklyWorkspace.tsx",
        "src/features/editor/components/PythonEditor.tsx",
        "src/features/python-runtime/pyodide-service.ts",
        "src/features/python-runtime/pyodide-loader.ts",
        // Next.js app shell files exercised by build + E2E
        "src/app/global-error.tsx",
        "src/app/layout.tsx",
        "src/app/manifest.ts",
        "src/app/robots.ts",
        "src/app/sitemap.ts",
        "src/app/python-editor/page.tsx",
        "src/app/block-editor/page.tsx",
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
