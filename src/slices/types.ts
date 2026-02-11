/**
 * FILE: src/slices/types.ts
 * PATH: /c:/Projects/react/employee-polls/src/slices/types.ts
 * DESCRIPTION: 
 * This file serves as the single source of truth for all TypeScript 
 * interfaces used across the Employee Polls application slices.
 * * UPDATE: Added 'VoteOption' export to support type safety in _DATA.ts 
 * while preserving all original Payload and State interfaces.
 */

/**
 * Valid keys for voting on a poll.
 */
export type VoteOption = 'optionOne' | 'optionTwo';

/**
 * Represents the currently logged-in user's ID state.
 */
export interface AuthedUserState {
  value: string | null;
}

/**
 * Structure for a single option within a poll.
 */
export interface QuestionOption {
  votes: string[];
  text: string;
}

/**
 * Core interface for a Poll/Question object.
 */
export interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: QuestionOption;
  optionTwo: QuestionOption;
}

/**
 * State structure for the questions slice (normalized).
 */
export interface QuestionsState {
  [key: string]: Question;
}

/**
 * Structure for a User object in the system.
 */
export interface User {
  id: string;
  password?: string;
  name: string;
  avatarURL: string;
  answers: { [questionId: string]: VoteOption };
  questions: string[];
}

/**
 * State structure for the users slice (normalized).
 */
export interface UsersState {
  [userId: string]: User;
}

/**
 * Payload structure for saving a new question to the database.
 */
export interface SaveQuestionPayload {
  author: string;
  optionOneText: string;
  optionTwoText: string;
}

/**
 * Payload structure for answering an existing poll.
 */
export interface AnswerPayload {
  authedUser: string;
  qid: string;
  answer: VoteOption;
}

/**
 * Combined Root State interface for use with useSelector and slice definitions.
 */
export interface RootState {
  questions: QuestionsState;
  users: UsersState;
  authedUser: AuthedUserState;
}