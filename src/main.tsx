import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * FILE: src/main.tsx
 * DESCRIPTION: 
 * This is the standard entry point for a React application using Redux and React Router.
 * It maintains clean imports for VS Code while using a safe-guard pattern
 * to ensure the preview environment remains stable.
 */

// Standard Imports for VS Code
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { store } from './store/store';
import './index.css';

// Environment Bridge (Safe-guards preview without breaking VS Code/Vite logic)
// This pattern avoids assigning JSX to variables, which resolves the Vite parsing error.
const Provider = (ReduxProvider as any) || (window as any).ReactRedux?.Provider || (({ children }: any) => <>{children}</>);
const BrowserRouter = (Router as any) || (window as any).ReactRouterDOM?.BrowserRouter || (({ children }: any) => <>{children}</>);

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
  console.error('Failed to find the root element. Ensure index.html has <div id="root"></div>');
}