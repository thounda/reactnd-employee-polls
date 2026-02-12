import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// @ts-ignore
import Dashboard from '../Dashboard';
// @ts-ignore
import questionsReducer from '../../slices/questionsSlice';
// @ts-ignore
import usersReducer from '../../slices/usersSlice';
// @ts-ignore
import authedUserReducer from '../../slices/authedUserSlice';

/**

File: Dashboard.test.tsx

Path: src/components/tests/Dashboard.test.tsx

Objective: Robust unit testing for the Dashboard component.

Verifies: Categorization of questions, tab switching, and count badges.
*/

const mockState = {
authedUser: {
value: 'sarahedo'
},
users: {
sarahedo: {
id: 'sarahedo',
name: 'Sarah Edo',
avatarURL: '',
answers: { "q1": "optionOne" },
questions: ['q2']
}
},
questions: {
"q1": {
id: 'q1',
author: 'sarahedo',
timestamp: 1467166872634,
optionOne: { votes: ['sarahedo'], text: 'Build a React App' },
optionTwo: { votes: [], text: 'Build an Angular App' },
},
"q2": {
id: 'q2',
author: 'sarahedo',
timestamp: 1468479767190,
optionOne: { votes: [], text: 'Eat Pizza' },
optionTwo: { votes: [], text: 'Eat Burger' },
}
}
};

const renderWithRedux = (
component: React.ReactElement,
{ initialState = mockState } = {}
) => {
const store = configureStore({
reducer: {
questions: questionsReducer,
users: usersReducer,
authedUser: authedUserReducer,
} as any,
preloadedState: initialState,
});

return render(
<Provider store={store}>
<MemoryRouter>
{component}
</MemoryRouter>
</Provider>
);
};

describe('Dashboard Component Tests', () => {
test('renders the dashboard with categorized tabs', () => {
renderWithRedux(<Dashboard />);
const buttons = screen.getAllByRole('button');
const unansweredTabExists = buttons.some(btn => btn.textContent?.includes('Unanswered Questions') || btn.textContent?.includes('New Questions'));
const answeredTabExists = buttons.some(btn => btn.textContent?.includes('Answered Questions') || btn.textContent?.includes('Done'));
expect(unansweredTabExists).toBe(true);
expect(answeredTabExists).toBe(true);
});

test('filters and displays unanswered questions by default', () => {
renderWithRedux(<Dashboard />);
// "Eat Pizza" (q2) has no votes from sarahedo
expect(screen.getByText(/Eat Pizza/i)).toBeInTheDocument();
// "Build a React App" (q1) is answered
expect(screen.queryByText(/Build a React App/i)).not.toBeInTheDocument();
});

test('toggles to display answered questions', () => {
renderWithRedux(<Dashboard />);
const buttons = screen.getAllByRole('button');
const answeredTab = buttons.find(btn =>
btn.textContent?.includes('Answered Questions') || btn.textContent?.includes('Done')
);
if (!answeredTab) throw new Error("Could not find Answered Questions tab");

fireEvent.click(answeredTab);

expect(screen.getByText(/Build a React App/i)).toBeInTheDocument();
expect(screen.queryByText(/Eat Pizza/i)).not.toBeInTheDocument();


});

test('displays correct question counts in tabs', () => {
renderWithRedux(<Dashboard />);
const buttons = screen.getAllByRole('button');

buttons.forEach(btn => {
  // Use the within(btn) helper to locate the count badge specifically within each tab
  const countElement = within(btn).getByText((_content, element) => {
    const check = (node: Element | null) => {
      const text = node?.textContent || "";
      // Matches (1) based on our mock data where each category has 1 item
      return text.replace(/\s+/g, '').includes('(1)');
    };

    const isMatch = check(element);
    const hasMatchingChild = Array.from(element?.children || []).some(child => check(child as Element));

    // Returns true only for the deepest element matching the criteria to avoid multiple hits
    return isMatch && !hasMatchingChild;
  });
  
  expect(countElement).toBeInTheDocument();
});


});
});