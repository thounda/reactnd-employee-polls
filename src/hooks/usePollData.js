/**
 * File: src/hooks/usePollData.js
 * Description: Custom React hook to manage initial data fetching and loading state
 * for users and questions from the Redux store.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleInitialData } from '../actions/shared.js';

/**
 * @description Custom hook to fetch initial application data and track loading status.
 * @returns {boolean} isLoading - True if initial data is still being loaded.
 */
export default function usePollData() {
  const dispatch = useDispatch();
  
  // Select the state needed to determine if loading is complete.
  // We check if 'users' and 'questions' have been populated.
  const users = useSelector((state) => state.users);
  const questions = useSelector((state) => state.questions);
  
  // Calculate loading status based on whether data exists.
  const isLoading = Object.keys(users).length === 0 || Object.keys(questions).length === 0;

  useEffect(() => {
    // If we're loading (i.e., data hasn't been fetched yet), dispatch the thunk to fetch it.
    if (isLoading) {
      dispatch(handleInitialData());
    }
  }, [dispatch, isLoading]); // Dependency on isLoading ensures this runs once when state is empty

  return isLoading;
}