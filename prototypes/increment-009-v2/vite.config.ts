import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@presentation': fileURLToPath(new URL('../../src/presentation', import.meta.url)) } },
  server: { host: '127.0.0.1', port: 4200, strictPort: true },
  build: { outDir: '/tmp/dtw-increment009-v2-dist', emptyOutDir: true },
});
