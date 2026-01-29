/**
FILE: src/types.ts
DESCRIPTION:
Centralized TypeScript interfaces for the Employee Polls application.
This file defines the shape of Users, Questions, and their nested objects
to ensure type safety across slices and components.
CATEGORY: Architecture (TypeScript Support)
*/

export interface User {
id: string;
password?: string;
name: string;
avatarURL: string;
/** answers: lookup table where key is question ID, value is the chosen option /
answers: { [qid: string]: 'optionOne' | 'optionTwo' };
/* questions: array of question IDs created by the user */
questions: string[];
}

export interface Users {
[userId: string]: User;
}

export interface QuestionOption {
votes: string[]; // Array of user IDs
text: string;
}

export interface Question {
id: string;
author: string;
timestamp: number;
optionOne: QuestionOption;
optionTwo: QuestionOption;
}

export interface Questions {
[qid: string]: Question;
}

/** * UI-specific helper for component props or selection state
*/
export type VoteOption = 'optionOne' | 'optionTwo';