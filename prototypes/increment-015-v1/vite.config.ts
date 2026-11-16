import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('.',import.meta.url)),plugins:[react(),tailwindcss()],server:{host:'127.0.0.1',port:4215,strictPort:true},build:{outDir:'/tmp/dtw-increment015-v1-dist',emptyOutDir:true}});
