/**
 * File: src/main.js
 * Description: The main entry point for the React application.
 * Initializes the Redux store, sets up routing, and renders the root component.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App.js';
import reducer from './reducers/index.js'; // Redux Root Reducer
import middleware from './middleware/index.js'; // Redux Middleware (including Thunk)
import './index.css';

// Create the Redux store with the combined reducers and middleware
// FIX: The middleware (enhancer) must be passed as the third argument.
// We use 'undefined' for the optional preloadedState argument.
const store = createStore(reducer, undefined, middleware); 

// Root rendering of the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provides the Redux store to the entire application */}
    <Provider store={store}>
      {/* Enables client-side routing */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);