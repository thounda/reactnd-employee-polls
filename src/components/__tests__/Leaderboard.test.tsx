/**
 * FILE NAME: Leaderboard.test.tsx
 * FILE PATH: src/components/__tests__/Leaderboard.test.tsx
 */

import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Leaderboard from '../Leaderboard';
import { renderWithProviders } from '../../test-utils';
import { describe, it, expect } from 'vitest';
import type { UsersState } from '../../slices/types';

// Mock data typed to match the project's UsersState
const mockUsers: UsersState = {
  sarahedo: {
    id: 'sarahedo',
    name: 'Sarah Edo',
    avatarURL: '',
    answers: { "q1": 'optionOne', "q2": 'optionTwo' },
    questions: ['q1']
  },
  tylermcginnis: {
    id: 'tylermcginnis',
    name: 'Tyler McGinnis',
    avatarURL: '',
    answers: { "q1": 'optionOne' },
    questions: ['q2', 'q3']
  },
  mtsamis: {
    id: 'mtsamis',
    name: 'Mike Tsamis',
    avatarURL: '',
    answers: { "q1": 'optionOne', "q2": 'optionTwo', "q3": 'optionOne' },
    questions: ['q4', 'q5']
  }
};

describe('Leaderboard Component', () => {
  it('should render all users and sort them by score (descending)', () => {
    renderWithProviders(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>,
      {
        preloadedState: {
          users: mockUsers,
          authedUser: { value: 'sarahedo' }
        }
      }
    );

    // Verify Mike Tsamis is rendered
    expect(screen.getByText('Mike Tsamis')).toBeInTheDocument();
    
    // Using getAllByText to handle multiple instances of numbers in the UI
    const impactElements = screen.getAllByText('3');
    const createdElements = screen.getAllByText('2');
    
    expect(impactElements.length).toBeGreaterThan(0);
    expect(createdElements.length).toBeGreaterThan(0);

    // Verify sorting by checking heading order
    const headings = screen.getAllByRole('heading', { level: 3 });
    const nameOrder = headings.map(h => h.textContent?.trim());

    // Mike Tsamis (Score: 5) should be 1st
    expect(nameOrder[0]).toBe('Mike Tsamis');
    expect(nameOrder).toContain('Sarah Edo');
    expect(nameOrder).toContain('Tyler McGinnis');
  });
});