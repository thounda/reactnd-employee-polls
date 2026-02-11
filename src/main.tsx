/**
 * @file src/main.tsx
 * @description
 * Main entry point for the Employee Polls application.
 * This file initializes the React application and establishes the 
 * provider hierarchy: Redux -> Router -> App.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        {/* The Router wraps App to provide navigation context 
          to all components, including the protected route logic.
        */}
        <Router>
          <App />
        </Router>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Critical: Root element not found. The application failed to mount.");
}

