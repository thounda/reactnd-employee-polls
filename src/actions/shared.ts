/**
 * FILE: src/actions/shared.ts
 * DESCRIPTION:
 * Contains thunks that involve multiple slices, such as the initial 
 * data fetch that populates both users and questions.
 */

import { getInitialData, saveQuestion, saveQuestionAnswer } from '../utils/_DATA';
import { receiveUsers, addQuestionToUser, addAnswerToUser } from '../slices/usersSlice';
import { receiveQuestions, addQuestion, addAnswer } from '../slices/questionsSlice';
import { AppDispatch } from '../store';

/**
 * Thunk to fetch initial data from the mock API and dispatch to reducers.
 */
export const handleInitialData = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const { users, questions } = await getInitialData();
      dispatch(receiveUsers(users));
      dispatch(receiveQuestions(questions));
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };
};

/**
 * Thunk to handle saving a new question.
 * Updates both the questions slice and the user's created questions list.
 */
export const handleSaveQuestion = (optionOneText: string, optionTwoText: string) => {
  return async (dispatch: AppDispatch, getState: any) => {
    const { authedUser } = getState();
    
    try {
      const question = await saveQuestion({
        optionOneText,
        optionTwoText,
        author: authedUser,
      });
      
      dispatch(addQuestion(question));
      dispatch(addQuestionToUser({ authedUser, qid: question.id }));
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };
};

/**
 * Thunk to handle saving a question answer (voting).
 * Updates both the questions slice and the user's answers list.
 */
export const handleSaveAnswer = (qid: string, answer: 'optionOne' | 'optionTwo') => {
  return async (dispatch: AppDispatch, getState: any) => {
    const { authedUser } = getState();
    const info = { authedUser, qid, answer };

    try {
      await saveQuestionAnswer(info);
      dispatch(addAnswer(info));
      dispatch(addAnswerToUser(info));
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };
};