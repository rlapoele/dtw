import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export const moduleAliases = {
  "@domain": fileURLToPath(new URL("./src/domain", import.meta.url)),
  "@application": fileURLToPath(new URL("./src/application", import.meta.url)),
  "@adapters": fileURLToPath(new URL("./src/adapters", import.meta.url)),
  "@presentation": fileURLToPath(new URL("./src/presentation", import.meta.url)),
  "@tests": fileURLToPath(new URL("./test", import.meta.url)),
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: moduleAliases },
});
