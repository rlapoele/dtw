import { defineConfig } from "vitest/config";
// Disposable historical prototype tests use a separate runner and package.
export default defineConfig({ test: { include: ["test/**/*.test.ts"] } });
