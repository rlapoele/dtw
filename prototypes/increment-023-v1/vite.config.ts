import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { moduleAliases } from "../../vite.config.ts";
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react(), tailwindcss()],
  resolve: { alias: moduleAliases },
  server: { host: "127.0.0.1", port: 4223, strictPort: true },
  build: { outDir: "/tmp/dtw-increment023-v1-dist", emptyOutDir: true },
});
