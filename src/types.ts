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
answers: { [qid: string]: 'optionOne' | 'optionTwo' };
questions: string[];
}

export interface Users {
[userId: string]: User;
}

export interface QuestionOption {
votes: string[];
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