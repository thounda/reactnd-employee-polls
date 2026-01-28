/**
 * File: src/actions/users.ts
 * Description: Action creators for users slice of state.
 * CATEGORY: Redux Actions / Users
 */

import { Users, Question } from '../types'; // Assuming these are in a central types file

// Action Types
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const ADD_USER_QUESTION = 'ADD_USER_QUESTION';
export const ADD_USER_ANSWER = 'ADD_USER_ANSWER';

/**
 * Action creator to load the initial set of users.
 * @param {Users} users - The users object from the API.
 */
export function receiveUsers(users: Users) {
  return {
    type: RECEIVE_USERS as typeof RECEIVE_USERS,
    users,
  };
}

/**
 * Action creator to update a user's 'answers' property when they vote.
 */
export function addUserAnswer({ authedUser, qid, answer }: { authedUser: string, qid: string, answer: string }) {
  return {
    type: ADD_USER_ANSWER as typeof ADD_USER_ANSWER,
    authedUser,
    qid,
    answer,
  };
}

/**
 * Action creator to update a user's 'questions' array when they create a new poll.
 * @param {Question} question - The complete question object.
 */
export function addUserQuestion(question: Question) {
  return {
    type: ADD_USER_QUESTION as typeof ADD_USER_QUESTION,
    question,
  };
}

// Union type for the User Reducer
export type UserActions = 
  | ReturnType<typeof receiveUsers>
  | ReturnType<typeof addUserAnswer>
  | ReturnType<typeof addUserQuestion>;