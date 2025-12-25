/**
 * File: src/actions/shared.js
 * Description: 
 * Defines the asynchronous action creator to handle the initial data load.
 * Updated to ensure the loading state in App.js can resolve.
 */

import { getInitialData } from '../utils/api';
import { receiveUsers } from './users';
import { receiveQuestions } from './questions';
// Import the action to set the authed user
import { setAuthedUser } from './authedUser';

/**
 * handleInitialData
 * Uses the thunk pattern to fetch data from the API.
 */
export function handleInitialData() {
  return (dispatch) => {
    return getInitialData()
      .then(({ users, questions }) => {
        dispatch(receiveUsers(users));
        dispatch(receiveQuestions(questions));
        
        /* * OPTIONAL: If you want to skip the login screen during dev, 
         * you can uncomment the line below to auto-login as 'sarahedo'.
         * Otherwise, leave it null and App.js should show the Login component.
         */
        // dispatch(setAuthedUser('sarahedo')); 
      })
      .catch((e) => {
        console.error('Error fetching initial data:', e);
      });
  };
}