import { defineConfig } from "vitest/config";
import { moduleAliases } from "./vite.config.ts";
// Disposable historical prototype tests use a separate runner and package.
export default defineConfig({
  resolve: { alias: moduleAliases },
  test: { include: ["test/**/*.test.ts"] },
});
