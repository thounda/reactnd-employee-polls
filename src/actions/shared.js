/**
 * File: src/actions/shared.js
 * Description: 
 * Defines the asynchronous action creator to handle the initial data load.
 * This fetches both users and questions from the mock database and
 * dispatches them to their respective reducers.
 */

import { getInitialData } from '../utils/api';
import { receiveUsers } from './users';
import { receiveQuestions } from './questions';

/**
 * handleInitialData
 * Uses the thunk pattern to fetch data from the API.
 * This is called once when the App component mounts.
 */
export function handleInitialData() {
  return (dispatch) => {
    // We can show a loading bar here later if needed
    return getInitialData().then(({ users, questions }) => {
      dispatch(receiveUsers(users));
      dispatch(receiveQuestions(questions));
    }).catch((e) => {
      console.error('Error fetching initial data:', e);
      // In a production app, you might dispatch a failure action here
    });
  };
}