/**
 * File: src/__tests__/App.test.tsx
 * Path: src/__tests__/App.test.tsx
 * Description: 
 * Application-level smoke tests and snapshot testing. 
 * Moved to __tests__ folder for better project organization.
 * Updated with @ts-ignore to bypass environment-specific resolution errors in the preview.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

// Updated relative paths to point back to the src directory
// @ts-ignore
import { store } from '../store/store'; 
// @ts-ignore
import App from '../App';

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

    const rootElement = document.body;
    expect(rootElement).toBeDefined();
  });

  /**
   * REQUIREMENT 1: Snapshot Testing
   * This generates a snapshot of the App component's initial render state.
   * When run locally via 'npx vitest', this will create a src/__tests__/__snapshots__ directory.
   */
  it('should match the snapshot of the initial render', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    
    // This will create a __snapshots__ directory locally when run via Vitest
    expect(asFragment()).toMatchSnapshot();
  });
});