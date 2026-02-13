/**

DESCRIPTION & OBJECTIVES:

FILE NAME: Dashboard.test.tsx

FILE PATH: src/components/tests/Dashboard.test.tsx

This test suite targets the Dashboard component of the Employee Polls application.

The primary objectives are:

Authentication Check: Ensure the dashboard identifies the logged-in user and displays relevant data.

Question Filtering: Verify polls are partitioned into 'Unanswered' and 'Answered'.

UI Interaction: Validate that toggling between tabs updates the view correctly.

Data Consistency: Confirm handling of empty states for both categories.
*/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

/* --- MOCKS --- */

const mockUseAppSelector = vi.fn();
vi.mock('../../store/hooks', () => ({
useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

vi.mock('../../slices/authedUserSlice', () => ({
selectAuthedUser: { name: 'selectAuthedUser' },
}));
vi.mock('../../slices/questionsSlice', () => ({
selectQuestions: { name: 'selectQuestions' },
}));
vi.mock('../../slices/usersSlice', () => ({
selectUsers: { name: 'selectUsers' },
}));

/* --- TEST DATA --- */

const mockUsers = {
sarahedo: {
id: 'sarahedo',
name: 'Sarah Edo',
avatarURL: 'https://www.google.com/search?q=https://test-avatar.com/sarah.png',
},
tylermcginnis: {
id: 'tylermcginnis',
name: 'Tyler McGinnis',
avatarURL: 'https://www.google.com/search?q=https://test-avatar.com/tyler.png',
}
};

const mockQuestions = {
'q1': {
id: 'q1',
author: 'sarahedo',
timestamp: 1467166872634,
optionOne: { votes: [] as string[], text: 'Build a Spaceship' },
optionTwo: { votes: [] as string[], text: 'Build a Submarine' },
},
'q2': {
id: 'q2',
author: 'tylermcginnis',
timestamp: 1468476767119,
optionOne: { votes: ['sarahedo'], text: 'Eat Pizza' },
optionTwo: { votes: [] as string[], text: 'Eat Burger' },
},
};

describe('Dashboard Component', () => {
beforeEach(() => {
vi.clearAllMocks();
});

const setupMockState = (
authedUser: string | null = 'sarahedo',
questions: Record<string, any> = mockQuestions,
users = mockUsers
) => {
mockUseAppSelector.mockImplementation((selector) => {
if (selector.name === 'selectAuthedUser') return authedUser;
if (selector.name === 'selectQuestions') return questions;
if (selector.name === 'selectUsers') return users;
return null;
});
};

const renderDashboard = () => {
return render(
<BrowserRouter>
<Dashboard />
</BrowserRouter>
);
};

it('1. Authentication Check: renders loading spinner when auth data is missing', () => {
setupMockState(null);
renderDashboard();
const spinner = document.querySelector('.animate-spin');
expect(spinner).toBeInTheDocument();
});

it('2. Question Filtering: partitions questions into Unanswered by default', () => {
setupMockState();
renderDashboard();
expect(screen.getByText(/Build a Spaceship/i)).toBeInTheDocument();
expect(screen.queryByText(/Eat Pizza/i)).not.toBeInTheDocument();
});

it('3. UI Interaction: toggles to Answered questions and updates view', () => {
setupMockState();
renderDashboard();

// Fix: Using a function for 'name' to ensure exact match and avoid substring collisions with 'Unanswered'
const answeredTab = screen.getByRole('button', { 
  name: (content) => content.startsWith('Answered Questions') 
});

fireEvent.click(answeredTab);

expect(screen.getByText(/Eat Pizza/i)).toBeInTheDocument();
expect(screen.queryByText(/Build a Spaceship/i)).not.toBeInTheDocument();


});

it('3. UI Interaction: displays correct count badges', () => {
setupMockState();
renderDashboard();

// Match the specific multi-line spacing rendered in the DOM
const badges = screen.getAllByText((content, element) => {
  return element?.tagName.toLowerCase() === 'span' && content.includes('(') && content.includes('1') && content.includes(')');
});
expect(badges.length).toBe(2);


});

it('4. Data Consistency: displays empty state message for unanswered questions', () => {
const allAnswered = {
'q1': {
...mockQuestions.q1,
optionOne: { ...mockQuestions.q1.optionOne, votes: ['sarahedo'] }
}
};
setupMockState('sarahedo', allAnswered);

renderDashboard();
expect(screen.getByText(/No unanswered questions found/i)).toBeInTheDocument();


});

it('4. Data Consistency: displays empty state message for answered questions', () => {
const noneAnswered = {
'q1': {
...mockQuestions.q1,
optionOne: { ...mockQuestions.q1.optionOne, votes: [] }
}
};
setupMockState('sarahedo', noneAnswered);

renderDashboard();

const answeredTab = screen.getByRole('button', { 
  name: (content) => content.startsWith('Answered Questions') 
});
fireEvent.click(answeredTab);

expect(screen.getByText(/No answered questions found/i)).toBeInTheDocument();


});
});