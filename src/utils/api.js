/**
 * File: src/utils/api.js
 * Description: The application's core API service wrapper. All Redux actions
 * import functions from here. This allows easy swapping of the underlying
 * data source (e.g., from _DATA.js to a real server endpoint) without
 * changing the actions.
 */
import {
  getInitialData as _getInitialData, // Renamed for clarity on import
  _saveQuestion,
  _saveQuestionAnswer,
} from './_DATA.js';

// The function exported to Redux actions for initial data fetching
export function getInitialData() {
  return _getInitialData();
}

// The function exported to Redux actions for saving new questions
export function saveQuestion(question) {
  return _saveQuestion(question);
}

// The function exported to Redux actions for saving user answers
export function saveQuestionAnswer(info) {
  return _saveQuestionAnswer(info);
}