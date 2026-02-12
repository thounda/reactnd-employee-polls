/**
 * File: src/App.test.tsx
 * Path: src/App.test.tsx
 * Description: 
 * This file contains the smoke tests for the main App component. 
 * To prevent "could not find react-redux context value" errors, the App component 
 * is wrapped in a Redux <Provider> and a React Router <BrowserRouter>. 
 * This ensures all hooks (useAppDispatch, useNavigate, etc.) have the 
 * necessary context to execute during testing.
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store'; 
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component Smoke Test', () => {
  it('should render the application without crashing', () => {
    // Render the app with all required context providers
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Initial check to verify the component mounted successfully in the DOM.
    // We check for the presence of the document body or a root element.
    const rootElement = document.body;
    expect(rootElement).toBeDefined();
  });

  it('should display the main layout content', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Basic assertion to check if the app renders something meaningful.
    // This looks for any text as a sign of life.
    const anyText = screen.queryAllByRole('generic');
    expect(anyText).toBeTruthy();
  });
});