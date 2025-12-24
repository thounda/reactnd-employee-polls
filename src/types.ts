/**
 * File: src/types.ts
 * Description: 
 * Centralized TypeScript interfaces and types for the Employee Polls application.
 * This file defines the shape of User and Question objects, as well as the 
 * record-based collections used by the Redux store and the mock API.
 */

export interface User {
  id: string;
  password?: string;
  name: string;
  avatarURL: string;
  answers: { [questionId: string]: string };
  questions: string[];
}

/**
 * Users:
 * A collection of User objects indexed by their unique ID string.
 * This matches the data structure in _DATA.js.
 */
export interface Users {
  [userId: string]: User;
}

export interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: {
    votes: string[];
    text: string;
  };
  optionTwo: {
    votes: string[];
    text: string;
  };
}

/**
 * Questions:
 * A collection of Question objects indexed by their unique ID string.
 */
export interface Questions {
  [questionId: string]: Question;
}

/**
 * AppData:
 * Helper type for the initial data fetch (getInitialData).
 */
export interface AppData {
  users: Users;
  questions: Questions;
}