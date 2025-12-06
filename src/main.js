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
const store = createStore(reducer, middleware);

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