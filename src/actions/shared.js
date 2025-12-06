/**
 * File: src/actions/shared.js
 * Description: Thunk action creator responsible for fetching initial application data
 * (users and questions) and dispatching actions to populate the store.
 */
import { getInitialData } from '../utils/api.js';
import { receiveUsers } from './users.js';         // ACTION CREATOR: from ./users.js
import { receiveQuestions } from './questions.js'; // ACTION CREATOR: from ./questions.js

// Action Type
export const GET_INITIAL_DATA = 'GET_INITIAL_DATA';

/**
 * @description Asynchronous action creator (Thunk) that fetches all users and questions
 * from the API and dispatches the necessary actions to update the Redux store.
 * @returns {function} A thunk function to be executed by the middleware.
 */
export function handleInitialData() {
  return (dispatch) => {
    // Show loading state or handle UI updates here if needed

    // Fetch both users and questions
    return getInitialData()
      .then(({ users, questions }) => {
        // Dispatch actions to save data to the respective reducers
        dispatch(receiveUsers(users));
        dispatch(receiveQuestions(questions));
        
        // Note: We deliberately do NOT dispatch setAuthedUser here. 
        // We let the Login component handle authentication after data is loaded.
      })
      .catch((error) => {
        console.error('Error fetching initial data: ', error);
        // Dispatch an error action or update a loading status to indicate failure
      });
  };
}