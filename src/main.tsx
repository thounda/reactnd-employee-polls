/**
 * @file src/main.tsx
 * @description
 * Main entry point for the Employee Polls application.
 * This file initializes the React application, attaches it to the DOM,
 * and wraps the App component with necessary Context Providers:
 * 1. React.StrictMode for highlighting potential problems.
 * 2. Redux Provider to provide the global state store.
 * 3. BrowserRouter (Router) to enable navigation logic throughout the app.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
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
        {/* The Router must wrap App here so that useNavigate, 
          useLocation, and Routes can be used within App.tsx 
          and all of its child components.
        */}
        <Router>
          <App />
        </Router>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Critical: Root element not found.");
}