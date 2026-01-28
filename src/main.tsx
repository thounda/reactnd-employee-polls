import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * File: src/main.tsx
 * Purpose: Entry point for the React application.
 * Description: 
 * This file handles the mounting of the root React component (App) 
 * into the physical DOM element with the ID of 'root'.
 */

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Critical: The root element was not found. Ensure <div id='root'></div> exists in your index.html.");
}