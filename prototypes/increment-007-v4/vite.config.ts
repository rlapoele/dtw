import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('.',import.meta.url)),cacheDir:"/tmp/dtw-increment007-v4-vite-cache",plugins:[react(),tailwindcss()],resolve:{alias:{'@domain':fileURLToPath(new URL('../../src/domain',import.meta.url)),'@application':fileURLToPath(new URL('../../src/application',import.meta.url)),'@adapters':fileURLToPath(new URL('../../src/adapters',import.meta.url)),'@presentation':fileURLToPath(new URL('../../src/presentation',import.meta.url))}},server:{host:'127.0.0.1',port:4227,strictPort:true},build:{outDir:'/tmp/dtw-increment007-v4-dist',emptyOutDir:true}});
