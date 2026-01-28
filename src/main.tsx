/**
 * FILE: src/main.tsx
 * PROJECT: Employee Polls Application
 * DESCRIPTION:
 * React entry point. Note the .tsx extension is required for JSX support.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error("No root element found with id 'root'");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);