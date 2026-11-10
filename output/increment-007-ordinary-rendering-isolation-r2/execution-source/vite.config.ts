import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('.',import.meta.url)),cacheDir:'/tmp/dtw-ordinary-isolation-r2-vite-cache',plugins:[react(),tailwindcss()],resolve:{alias:{'@domain':fileURLToPath(new URL('../../src/domain',import.meta.url)),'@application':fileURLToPath(new URL('../../src/application',import.meta.url)),'@adapters':fileURLToPath(new URL('../../src/adapters',import.meta.url)),'@presentation':fileURLToPath(new URL('../../src/presentation',import.meta.url))}},build:{outDir:'/tmp/dtw-ordinary-isolation-r2-build',emptyOutDir:true}});
