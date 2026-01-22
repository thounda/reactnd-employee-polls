/**
 * File: src/actions/users.ts
 * Description: Action creators for users slice of state.
 * CATEGORY: Redux Actions / Users
 */

// We import types to ensure the action payloads match our state structure
interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: { [qid: string]: string };
  questions: string[];
}

interface Users {
  [id: string]: User;
}

interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: { votes: string[]; text: string };
  optionTwo: { votes: string[]; text: string };
}

// Action Types
export const RECEIVE_USERS = 'RECEIVE_USERS' as const;
export const ADD_USER_QUESTION = 'ADD_USER_QUESTION' as const;
export const ADD_USER_ANSWER = 'ADD_USER_ANSWER' as const;

/**
 * Action creator to load the initial set of users.
 */
export function receiveUsers(users: Users) {
  return {
    type: RECEIVE_USERS,
    users,
  };
}

/**
 * Action creator to update a user's 'answers' property.
 */
export function addUserAnswer({ authedUser, qid, answer }: { authedUser: string, qid: string, answer: string }) {
  return {
    type: ADD_USER_ANSWER,
    authedUser,
    qid,
    answer,
  };
}

/**
 * Action creator to update a user's 'questions' property.
 * EXPECTS: The complete question object.
 */
export function addUserQuestion(question: Question) {
  return {
    type: ADD_USER_QUESTION,
    question,
  };
}

// Union type for the User Reducer
export type UserActions = 
  | ReturnType<typeof receiveUsers>
  | ReturnType<typeof addUserAnswer>
  | ReturnType<typeof addUserQuestion>;