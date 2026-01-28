/// <reference types="vite/client" />

/**
 * File: src/vite-env.d.ts
 * Purpose: TypeScript type definitions for the Vite environment and global data structures.
 */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Global interface for a Poll Question used throughout the application.
 */
interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: {
    votes: string[];
    text: string;
  };
  optionTwo: {
    votes: string[];
    text: string;
  };
}