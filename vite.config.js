import { fileURLToPath, URL } from 'node:url'
import { env } from './src/js/env'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
      // "/chatai" : {
      //   target: env.gateway
      // },
      // "/blog": {
      //   target: env.gateway
      // },
      // "/obs": {
      //   target: env.gateway
      // }
    // }
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
