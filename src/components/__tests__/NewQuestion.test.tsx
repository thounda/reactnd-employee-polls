/**
 * File: NewQuestion.test.tsx
 * Path: src/components/__tests__/NewQuestion.test.tsx
 * Description: Unit tests for the NewQuestion component. 
 * Updated to correctly verify Thunk-based dispatching and navigation logic.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import NewQuestion from '../NewQuestion';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock navigation
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

// Simple reducer to satisfy the store requirements
const mockReducer = (state = {}, action: any) => state;

describe('NewQuestion Component', () => {
  let store: any;

  beforeEach(() => {
    // Create the mock store
    store = configureStore({
      reducer: {
        questions: mockReducer,
        authedUser: () => ({ id: 'sarahedo' }),
      },
      // Disable serializability check middleware for tests if needed, 
      // though our mock handles the unwrap properly now.
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });

    // Spy on dispatch and ensure it returns a mock object that supports .unwrap()
    // Since handleAddQuestion likely uses an async thunk, dispatch receives a function.
    vi.spyOn(store, 'dispatch').mockImplementation((action) => {
      if (typeof action === 'function') {
        // Return a mock result that allows .unwrap()
        return { unwrap: () => Promise.resolve() };
      }
      return action;
    });
    
    mockedUsedNavigate.mockClear();
  });

  it('renders correctly with empty fields and a disabled submit button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewQuestion />
        </MemoryRouter>
      </Provider>
    );

    // Using exact placeholder strings from the component source
    expect(screen.getByPlaceholderText('Enter first option...')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter second option...')).toHaveValue('');
    expect(screen.getByRole('button', { name: /Submit Poll/i })).toBeDisabled();
  });

  it('enables the submit button only when both fields have text', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewQuestion />
        </MemoryRouter>
      </Provider>
    );

    const input1 = screen.getByPlaceholderText('Enter first option...');
    const input2 = screen.getByPlaceholderText('Enter second option...');
    const submitBtn = screen.getByRole('button', { name: /Submit Poll/i });

    fireEvent.change(input1, { target: { value: 'Option A' } });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(input2, { target: { value: 'Option B' } });
    expect(submitBtn).toBeEnabled();
  });

  it('dispatches the action and navigates on submit', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewQuestion />
        </MemoryRouter>
      </Provider>
    );

    const input1 = screen.getByPlaceholderText('Enter first option...');
    const input2 = screen.getByPlaceholderText('Enter second option...');
    const submitBtn = screen.getByRole('button', { name: /Submit Poll/i });

    fireEvent.change(input1, { target: { value: 'Option A' } });
    fireEvent.change(input2, { target: { value: 'Option B' } });
    fireEvent.click(submitBtn);

    // Because handleAddQuestion uses a thunk, we expect dispatch to be called with a function.
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
    });

    // Verify navigation occurs after the "thunk" completes
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });
});