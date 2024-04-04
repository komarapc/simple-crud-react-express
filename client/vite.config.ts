import * as path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {TanStackRouterVite } from "@tanstack/router-vite-plugin"
const __dirname = path.resolve()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),TanStackRouterVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
