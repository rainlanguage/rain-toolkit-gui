import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      'bn.js',
      'js-sha3',
      'hash.js',
      'aes-js',
      'scrypt-js',
      'bech32'
    ]
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      $components: path.resolve('./src/components'),
      $stores: path.resolve('./src/stores'),
      $routes: path.resolve('./src/routes'),
      $src: path.resolve('./src'),
    }
  }
})
