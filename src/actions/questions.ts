/**
 * FILE: src/actions/questions.ts
 * DESCRIPTION:
 * Handles asynchronous thunks for creating questions and saving answers.
 * This file coordinates updates between questionsSlice and usersSlice
 * to maintain data integrity (Architecture Requirement).
 * CATEGORY: Application Functionality
 */

import { saveQuestion, saveQuestionAnswer } from '../utils/_DATA';
import { addQuestion, addAnswerToQuestion } from '../slices/questionsSlice';
import { addQuestionToUser, addAnswerToUser } from '../slices/usersSlice';
import { AppDispatch } from '../store';

/**
 * Thunk to handle saving a new poll/question.
 * Dispatches to both questions and users slices.
 */
export function handleAddQuestion(optionOneText: string, optionTwoText: string) {
  return (dispatch: AppDispatch, getState: any) => {
    const { authedUser } = getState();

    return saveQuestion({
      optionOneText,
      optionTwoText,
      author: authedUser,
    }).then((question) => {
      dispatch(addQuestion(question));
      dispatch(addQuestionToUser({ 
        authedUser: question.author, 
        qid: question.id 
      }));
    });
  };
}

/**
 * Thunk to handle saving a vote (answer).
 * Dispatches to both questions and users slices.
 */
export function handleSaveQuestionAnswer(qid: string, answer: 'optionOne' | 'optionTwo') {
  return (dispatch: AppDispatch, getState: any) => {
    const { authedUser } = getState();

    return saveQuestionAnswer({
      authedUser,
      qid,
      answer,
    }).then(() => {
      // Update Question State
      dispatch(addAnswerToQuestion({ authedUser, qid, answer }));
      // Update User State
      dispatch(addAnswerToUser({ authedUser, qid, answer }));
    });
  };
}