/**
 * FILE: src/main.tsx
 * DESCRIPTION: 
 * The application entry point. It wraps the App component with the 
 * Redux Provider and React Router to provide global state and routing.
 * Updated with explicit paths to resolve environment compilation issues.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Importing App and Store with precise relative paths
import App from './App.tsx';
import { store } from './store/store.ts';

// Main global styles
import './index.css';

// Ensure the root element exists in the DOM before rendering
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      {/* The Provider component makes the Redux store available 
          to any nested components that need to access it.
      */}
      <Provider store={store}>
        {/* BrowserRouter uses the HTML5 history API to keep 
            your UI in sync with the URL.
        */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure index.html has an element with id='root'.");
}