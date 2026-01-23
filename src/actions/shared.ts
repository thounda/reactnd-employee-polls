/**
 * FILE: src/actions/shared.ts
 * DESCRIPTION:
 * Contains thunk-like logic to handle initial data loading and 
 * cross-slice synchronization. It uses the mock API to fetch 
 * users and questions, then populates the store.
 * CATEGORY: Architecture (Data Handling)
 */

import { getInitialData } from '../utils/_DATA';
import { receiveUsers } from '../slices/usersSlice';
import { receiveQuestions } from '../slices/questionsSlice';
import { AppDispatch } from '../store';

/**
 * Initial Data Loader
 * Fetches data from the mock API and dispatches to users and questions slices.
 */
export function handleInitialData() {
  return (dispatch: AppDispatch) => {
    return getInitialData().then(({ users, questions }) => {
      dispatch(receiveUsers(users));
      dispatch(receiveQuestions(questions));
    });
  };
}