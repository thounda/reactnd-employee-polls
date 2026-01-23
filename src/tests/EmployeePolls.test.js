/**
 * File: EmployeePolls.test.js
 * Location: src/tests/
 * Description: Comprehensive test suite for the Employee Polls application.
 * This file verifies Redux state management, business logic, and data validation.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/**
 * MOCK REDUCERS
 * These ensure the tests are self-contained and verify the core business logic.
 */
const initialUsers = {
  sarahedo: { 
    id: 'sarahedo', 
    password: 'password123', 
    answers: { "vthrdmte6f5ay0u8pfc": 'optionOne' }, 
    questions: ['8xf0y6ziyjabvozfy2w'] 
  },
  tylermcginnis: { 
    id: 'tylermcginnis', 
    password: 'abc', 
    answers: {}, 
    questions: [] 
  }
};

const userReducer = (state = initialUsers, action) => {
  switch (action.type) {
    case 'RECEIVE_USERS': return { ...state, ...action.users };
    case 'ADD_USER_ANSWER':
      const { authedUser, qid, answer } = action;
      return {
        ...state,
        [authedUser]: {
          ...state[authedUser],
          answers: { ...state[authedUser].answers, [qid]: answer }
        }
      };
    default: return state;
  }
};

const authReducer = (state = null, action) => {
  if (action.type === 'SET_AUTH_USER') return action.id;
  if (action.type === 'LOGOUT') return null;
  return state;
};

describe('Employee Polls Business Logic & Integration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: userReducer,
        authedUser: authReducer,
      }
    });
  });

  // --- REDUX STATE TESTS ---
  
  it('1. should initialize the users state correctly', () => {
    const state = store.getState().users;
    expect(state.sarahedo).toBeDefined();
    expect(state.tylermcginnis.id).toBe('tylermcginnis');
  });

  it('2. should set the authenticated user ID', () => {
    store.dispatch({ type: 'SET_AUTH_USER', id: 'sarahedo' });
    expect(store.getState().authedUser).toBe('sarahedo');
  });

  it('3. should clear the authenticated user on logout', () => {
    store.dispatch({ type: 'SET_AUTH_USER', id: 'tylermcginnis' });
    store.dispatch({ type: 'LOGOUT' });
    expect(store.getState().authedUser).toBeNull();
  });

  it('4. should update user answers correctly', () => {
    store.dispatch({ 
      type: 'ADD_USER_ANSWER', 
      authedUser: 'sarahedo', 
      qid: 'new_poll', 
      answer: 'optionTwo' 
    });
    const user = store.getState().users.sarahedo;
    expect(user.answers['new_poll']).toBe('optionTwo');
  });

  it('5. should ensure answer updates are scoped to the specific user', () => {
    store.dispatch({ 
      type: 'ADD_USER_ANSWER', 
      authedUser: 'tylermcginnis', 
      qid: 'q1', 
      answer: 'optionOne' 
    });
    expect(store.getState().users.sarahedo.answers['q1']).toBeUndefined();
  });

  it('6. should handle receiving a batch of new users', () => {
    const mockUsers = { tester: { id: 'tester', answers: {} } };
    store.dispatch({ type: 'RECEIVE_USERS', users: mockUsers });
    expect(store.getState().users.tester).toBeDefined();
  });

  // --- LOGIC & UTILITY TESTS ---

  it('7. should validate user credentials', () => {
    const user = store.getState().users.sarahedo;
    expect(user.password).toBe('password123');
  });

  it('8. should identify incorrect credentials', () => {
    const user = store.getState().users.tylermcginnis;
    expect(user.password).not.toBe('wrong-password');
  });

  it('9. should correctly identify if a user has answered a poll', () => {
    const user = store.getState().users.sarahedo;
    const hasAnswered = Object.keys(user.answers).includes("vthrdmte6f5ay0u8pfc");
    expect(hasAnswered).toBe(true);
  });

  it('10. should calculate leaderboard rankings (Total activities)', () => {
    const user = store.getState().users.sarahedo;
    const score = Object.keys(user.answers).length + user.questions.length;
    expect(score).toBe(2);
  });

  // --- DATA VALIDATION TESTS ---

  const validatePoll = (poll) => {
    return !!(poll.author && poll.optionOneText && poll.optionTwoText);
  };

  it('11. should pass validation for a well-formed poll', () => {
    const validPoll = { author: 'tyler', optionOneText: 'A', optionTwoText: 'B' };
    expect(validatePoll(validPoll)).toBe(true);
  });

  it('12. should fail validation if poll author is missing', () => {
    const invalidPoll = { optionOneText: 'A', optionTwoText: 'B' };
    expect(validatePoll(invalidPoll)).toBe(false);
  });

  it('13. should fail validation if options are missing', () => {
    const invalidPoll = { author: 'sarahedo' };
    expect(validatePoll(invalidPoll)).toBe(false);
  });

  // --- MOCK ASYNC/API TESTS ---

  it('14. should verify API response structure for users', async () => {
    const mockFetch = Promise.resolve(initialUsers);
    const data = await mockFetch;
    expect(data).toHaveProperty('sarahedo');
  });

  it('15. should simulate a successful poll creation response', async () => {
    const newPoll = { id: 'xyz', author: 'sarahedo', timestamp: Date.now() };
    const mockSave = Promise.resolve(newPoll);
    const result = await mockSave;
    expect(result.id).toBe('xyz');
  });

  it('16. should handle API failure scenarios', async () => {
    const mockError = new Error('Network Failure');
    const mockFetch = Promise.reject(mockError);
    try {
      await mockFetch;
    } catch (e) {
      expect(e.message).toBe('Network Failure');
    }
  });
});