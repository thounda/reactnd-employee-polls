/**
 * FILE: src/tests/Dashboard.test.js
 * DESCRIPTION: 
 * Unit and snapshot tests for the Dashboard component.
 * Verifies that the dashboard correctly renders poll data from the Redux store.
 */

// @vitest-environment jsdom

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
// Path adjusted to look in the components folder from the tests folder
import Dashboard from '../components/Dashboard.js';

/**
 * TEST DATA (MOCK STATE)
 * Configured so that the user 'sarahedo' has not answered the poll,
 * ensuring it appears in the "New Questions" section.
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
      answers: {}, 
      questions: ['8xf0y6ziyj7ifthhx832']
    }
  }
};

const mockReducer = (state = initialState) => state;

/**
 * RENDER UTILITY
 * Wraps the Dashboard in Redux and Router context.
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
     * Verify that the UI renders the user's name "Sarah Edo"
     * associated with the poll author.
     */
    const authorName = await screen.findByText(/Sarah Edo/i);
    expect(authorName).toBeDefined();
  });

  it('should match the existing UI snapshot', () => {
    const { asFragment } = renderWithProviders(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });
});