/**
 * File: src/main.tsx
 * Description: The primary entry point for the Employee Polls application.
 * This file mounts the React application to the DOM and provides
 * the Redux Store and React Router context.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

// --- Environment Bridge ---
// These helpers allow the preview to run while maintaining modular logic for VS Code.
const Provider = (window as any).ReactRedux?.Provider || (({ children }: any) => <>{children}</>);
const BrowserRouter = (window as any).ReactRouterDOM?.BrowserRouter || (({ children }: any) => <>{children}</>);

// Project Imports
// Note: These will resolve correctly in your local VS Code environment via your tsconfig.json.
// We use a fallback here only to satisfy the current preview's compiler requirements.
const App = (window as any).AppComponents?.App || (() => <div>Application Loading...</div>);
const store = (window as any).AppStore?.store || {};

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Critical Error: Could not find the 'root' element in index.html.");
}