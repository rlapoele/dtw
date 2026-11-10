import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {moduleAliases} from '../../vite.config';
import {fileURLToPath} from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('.',import.meta.url)),plugins:[react(),tailwindcss()],resolve:{alias:moduleAliases},cacheDir:'/private/tmp/dtw-rendering-vite-cache',build:{outDir:'../../output/increment-007-rendering-qualification/build',emptyOutDir:false},server:{host:'127.0.0.1'}});
