/**
 * File: src/tests/_DATA.test.js
 * Description: 
 * Unit tests for the mock database functions provided in _DATA.js.
 * This ensures that the asynchronous data persistence logic works as expected
 * for both success and failure scenarios.
 */

import { describe, it, expect } from 'vitest';
// Adjusted path to point to the utils directory from the tests directory
import { _saveQuestion, _saveQuestionAnswer } from '../utils/_DATA';

describe('_saveQuestion', () => {
  it('should return the saved question and update the database when valid data is passed', async () => {
    const validQuestion = {
      optionOneText: 'Write Integration Tests',
      optionTwoText: 'Write Unit Tests',
      author: 'sarahedo',
    };
    
    const result = await _saveQuestion(validQuestion);
    
    // Verify the structure and content of the returned object
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('timestamp');
    expect(result.author).toBe('sarahedo');
    expect(result.optionOne.text).toBe('Write Integration Tests');
    expect(result.optionTwo.text).toBe('Write Unit Tests');
    expect(Array.isArray(result.optionOne.votes)).toBe(true);
  });

  it('should return an error if missing fields are passed', async () => {
    const invalidQuestion = {
      optionOneText: 'Missing other fields',
      // author and optionTwoText are missing
    };
    
    // Verify the promise rejects with the specific error message defined in _DATA.js
    await expect(_saveQuestion(invalidQuestion)).rejects.toEqual(
      'Please provide optionOneText, optionTwoText, and author'
    );
  });
});

describe('_saveQuestionAnswer', () => {
  it('should return true and update state when valid answer data is passed', async () => {
    /**
     * To ensure a valid test, we first create a question 
     * so we have a legitimate qid to answer.
     */
    const newQuestion = await _saveQuestion({
      optionOneText: 'Blue',
      optionTwoText: 'Red',
      author: 'mtsamis'
    });

    const validPayload = {
      authedUser: 'sarahedo',
      qid: newQuestion.id,
      answer: 'optionOne',
    };
    
    const result = await _saveQuestionAnswer(validPayload);
    expect(result).toBe(true);
  });

  it('should return an error if the answer payload is incomplete', async () => {
    const invalidPayload = {
      authedUser: 'sarahedo',
      qid: 'any-id',
      // 'answer' field is intentionally missing
    };
    
    await expect(_saveQuestionAnswer(invalidPayload)).rejects.toEqual(
      'Please provide authedUser, qid, and answer'
    );
  });
});