/**
 * File Name: setupTests.ts
 * Path: src/setupTests.ts
 * * Description:
 * This is the global configuration file for Vitest. It initializes the testing environment
 * by importing '@testing-library/jest-dom' to provide custom matchers (like .toBeInTheDocument()).
 * It also sets up a global 'afterEach' hook to ensure the virtual DOM is cleaned up 
 * after every test, preventing state leakage between test suites.
 * * Note: This file is referenced in the 'setupFiles' property of the vite.config.ts.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically unmount React trees after each test
afterEach(() => {
  cleanup();
});