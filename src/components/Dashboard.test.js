/**
 * FILE: src/components/Dashboard.test.js
 * DESCRIPTION: 
 * This file contains unit and snapshot tests for the Dashboard component.
 * It uses the 'vitest-environment-jsdom' directive to simulate a browser 
 * environment. The mock state is configured to ensure at least one 
 * question is displayed in the "New Questions" category.
 */

// @vitest-environment jsdom

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard.js';

/**
 * TEST DATA (MOCK STATE)
 * The mock state provides the necessary context for the Dashboard to render.
 * Using 'Sarah Edo' as the display name to match UI expectations.
 */
const initialState = {
  authedUser: 'sarahedo',
  questions: {
    "8xf0y6ziyj7ifthhx832": {
      id: '8xf0y6ziyj7ifthhx832',
      author: 'sarahedo',
      timestamp: 1467166872634,
      optionOne: { votes: [], text: 'have horrible short term memory' },
      optionTwo: { votes: [], text: 'have horrible long term memory' }
    }
  },
  users: {
    sarahedo: {
      id: 'sarahedo',
      name: 'Sarah Edo',
      answers: {}, // Question remains unanswered to appear in "New Questions"
      questions: ['8xf0y6ziyj7ifthhx832']
    }
  }
};

const mockReducer = (state = initialState) => state;

/**
 * RENDER UTILITY
 * Wraps the Dashboard in a Redux Provider and Router for a complete test context.
 */
const renderWithProviders = (ui) => {
  const store = createStore(mockReducer, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('Dashboard Component Tests', () => {
  it('should display the dashboard and show the display name of the author', async () => {
    renderWithProviders(<Dashboard />);
    
    // Verify Dashboard header is present
    const heading = screen.getByText(/Dashboard/i);
    expect(heading).toBeDefined();

    /**
     * The UI correctly renders the user's name "Sarah Edo".
     * findByText is used to handle any asynchronous rendering.
     */
    const authorName = await screen.findByText(/Sarah Edo/i);
    expect(authorName).toBeDefined();
  });

  it('should match the existing UI snapshot', () => {
    const { asFragment } = renderWithProviders(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });
});