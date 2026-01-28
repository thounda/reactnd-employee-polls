/**
 * FILE: src/actions/questions.ts
 * DESCRIPTION: Handles asynchronous thunks for creating questions and saving answers.
 * This version uses the typed interfaces from _DATA.ts for full type safety.
 */

import { _saveQuestion, _saveQuestionAnswer, Question } from '../utils/_DATA';
import { addQuestion, addAnswerToQuestion } from '../slices/questionsSlice';
import { addQuestionToUser, addAnswerToUser } from '../slices/usersSlice';
import { AppDispatch, RootState } from '../store';

/**
 * Thunk to handle saving a new poll/question.
 * It coordinates updates between the questions slice and the users slice.
 */
export function handleAddQuestion(optionOneText: string, optionTwoText: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const { authedUser } = getState();

    // Guard clause to ensure we have an authenticated user before saving
    if (!authedUser) {
        return Promise.reject("You must be logged in to create a poll.");
    }

    return _saveQuestion({
      optionOneText,
      optionTwoText,
      author: authedUser,
    }).then((question: Question) => {
      // Update the questions state with the new question object
      dispatch(addQuestion(question));
      
      // Update the user's state to include this new question ID in their 'questions' array
      dispatch(addQuestionToUser({ 
        authedUser: question.author, 
        qid: question.id 
      }));
    });
  };
}

/**
 * Thunk to handle saving a user's vote (answer).
 */
export function handleSaveQuestionAnswer(qid: string, answer: 'optionOne' | 'optionTwo') {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const { authedUser } = getState();

    if (!authedUser) {
        return Promise.reject("You must be logged in to vote.");
    }

    return _saveQuestionAnswer({
      authedUser,
      qid,
      answer,
    }).then(() => {
      // Add the user's ID to the question's vote array in the questions slice
      dispatch(addAnswerToQuestion({ authedUser, qid, answer }));
      
      // Add the question ID and answer to the user's 'answers' object in the users slice
      dispatch(addAnswerToUser({ authedUser, qid, answer }));
    });
  };
}