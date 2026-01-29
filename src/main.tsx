/**
 * @file src/main.tsx
 * @description
 * Main entry point for the Employee Polls application.
 * Optimized for local development in VS Code while maintaining build compatibility.
 * * NOTE: For local VS Code usage, ensure the imports in "STEP 1" are active.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';


const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      
    </React.StrictMode>
  );
} else {
  console.error("Critical: Root element not found.");
}