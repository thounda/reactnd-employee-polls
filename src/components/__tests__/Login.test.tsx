/**
 * File: src/components/__tests__/Login.test.tsx
 * Path: /src/components/__tests__/Login.test.tsx
 * Purpose: Integration tests for the Login component ensuring dropdown selection and UI state.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { useAppSelector, useAppDispatch } from '../../store/hooks';

// Mocking Redux hooks
vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

// Mocking slices
vi.mock('../../slices/authedUserSlice', () => ({
  setAuthedUser: vi.fn((id) => ({ type: 'authedUser/set', payload: id })),
}));

describe('Login Component', () => {
  const dispatch = vi.fn();
  const mockUsers = {
    sarahedo: { id: 'sarahedo', name: 'Sarah Edo', avatarURL: '' },
    tylermcginnis: { id: 'tylermcginnis', name: 'Tyler McGinnis', avatarURL: '' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppDispatch as any).mockReturnValue(dispatch);
    
    /**
     * The component accesses state via: const users = useAppSelector((state) => state.users);
     * We simulate the state object being passed to the selector function.
     */
    (useAppSelector as any).mockImplementation((selectorFn: any) => {
      const mockState = { users: mockUsers };
      return selectorFn(mockState);
    });
  });

  it('renders the login screen header', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/Employee Polls/i)).toBeInTheDocument();
  });

  it('contains an "Authenticate" button that is initially disabled', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const authButton = screen.getByRole('button', { name: /Authenticate/i });
    expect(authButton).toBeInTheDocument();
    expect(authButton).toBeDisabled();
  });

  it('allows selecting a user from the dropdown and enables the button', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    // Find select by label text
    const select = screen.getByLabelText(/Identify Yourself/i) as HTMLSelectElement;
    
    // Wait for the options to be rendered from state
    await waitFor(() => {
      expect(screen.getByText('Sarah Edo')).toBeInTheDocument();
    });

    // Simulate selection
    fireEvent.change(select, { target: { value: 'sarahedo' } });
    
    // Assert value and button state
    expect(select.value).toBe('sarahedo');
    const authButton = screen.getByRole('button', { name: /Authenticate/i });
    expect(authButton).not.toBeDisabled();
  });

  it('dispatches login action on form submission', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const select = screen.getByLabelText(/Identify Yourself/i);
    fireEvent.change(select, { target: { value: 'sarahedo' } });

    const authButton = screen.getByRole('button', { name: /Authenticate/i });
    fireEvent.click(authButton);

    expect(dispatch).toHaveBeenCalled();
  });
});