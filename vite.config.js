import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'mpa',
  plugins: [svelte(), nodePolyfills({
    include: ['buffer', 'util'],
  }),],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
  },
});
