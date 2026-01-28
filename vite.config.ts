import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * File: vite.config.ts
 * Description: Optimized Vite configuration for React TypeScript projects.
 * We've removed the manual 'jsx' loaders because the react-jsx transform 
 * in your tsconfig handles this more cleanly.
 */
export default defineConfig({
  plugins: [
    react({
      // The plugin automatically handles JSX in .jsx and .tsx files.
      // We include .js here just in case you have legacy files.
      include: /\.(js|jsx|ts|tsx)$/,
    }),
  ],
  resolve: {
    // Ensuring .tsx and .ts are prioritized
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: true,
    },
  },
  build: {
    // Ensures the build process aligns with your TS target
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});