/**
 * File: Login.test.tsx
 * Path: src/components/__tests__/Login.test.tsx
 * Description: Unit and integration tests for the Login component. 
 * Objectives:
 * 1. Verify the component renders the initial UI correctly (form, dropdown, and branding).
 * 2. Ensure user data from the Redux store is correctly mapped to the dropdown options.
 * 3. Validate form state management, specifically the "Authenticate" button's enabled/disabled logic.
 * 4. Test the login flow, including Redux action dispatching (setAuthedUser).
 * 5. Confirm the navigation logic handles both default redirection and "from" state redirection for intercepted routes.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

// Mocking Redux hooks and actions
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector({
    users: {
      sarahedo: { id: 'sarahedo', name: 'Sarah Edo' },
      tylermcginnis: { id: 'tylermcginnis', name: 'Tyler McGinnis' },
    }
  }),
}));

// Mocking react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
  };
});

// Import the mocked useLocation to control it per test
import { useLocation as mockedUseLocation } from 'react-router-dom';

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (mockedUseLocation as any).mockReturnValue({ state: null });
  });

  it('1. Initial UI: renders the login form with default state', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/Employee Polls/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identify Yourself/i)).toBeInTheDocument();
    
    // Check if the button is initially disabled
    const submitButton = screen.getByRole('button', { name: /Authenticate/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('bg-slate-100');
  });

  it('2. Data Loading: populates the dropdown with users from the store', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveDisplayValue('Choose a team member...');
    
    // Check for specific users in the list
    expect(screen.getByText('Sarah Edo')).toBeInTheDocument();
    expect(screen.getByText('Tyler McGinnis')).toBeInTheDocument();
  });

  it('3. Interaction: enables the button when a user is selected', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /Authenticate/i });

    // Simulate selecting a user
    fireEvent.change(select, { target: { value: 'sarahedo' } });

    expect(select).toHaveValue('sarahedo');
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveClass('bg-slate-900');
  });

  it('4. Login Flow: dispatches setAuthedUser and navigates on submit', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /Authenticate/i });

    fireEvent.change(select, { target: { value: 'tylermcginnis' } });
    fireEvent.click(submitButton);

    // Verify action dispatch (setAuthedUser logic)
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    
    // Verify navigation happened to the default path "/"
    expect(mockNavigate).toHaveBeenCalledWith({ pathname: "/" }, { replace: true });
  });

  it('5. Redirect Logic: navigates to the "from" location if it exists in state', () => {
    // Setup a specific "from" path in the location state
    const targetPath = '/add';
    (mockedUseLocation as any).mockReturnValue({
      state: { from: { pathname: targetPath } }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /Authenticate/i });

    fireEvent.change(select, { target: { value: 'sarahedo' } });
    fireEvent.click(submitButton);

    // Verify navigation returned the user to the intercepted page
    expect(mockNavigate).toHaveBeenCalledWith({ pathname: targetPath }, { replace: true });
  });

  it('6. Visual Feedback: changes select value when user interaction occurs', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    
    fireEvent.change(select, { target: { value: 'tylermcginnis' } });
    expect(select.value).toBe('tylermcginnis');
    
    fireEvent.change(select, { target: { value: 'sarahedo' } });
    expect(select.value).toBe('sarahedo');
  });
});