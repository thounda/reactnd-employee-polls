/**
 * File: vite.config.js
 * Description: Configuration file for Vite.
 * This version includes all necessary fixes to allow JSX inside .js files,
 * resolving both the esbuild and the import analysis parsing errors.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // 1. Ensure the React plugin treats .js files as JSX during the main dev/build
      include: ['src/**/*.js', 'src/**/*.jsx'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.json'],
  },
  // 2. CRITICAL FIX: Configure esbuild (used for dependency optimization and import analysis)
  // to globally apply the JSX loader to all .js files, resolving the persistent parsing error.
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/, // Target all .js files in src/
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Keep this for pre-bundling scan
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});