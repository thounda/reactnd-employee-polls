/**
 * File: src/_DATA.test.js
 * Description: 
 * Unit tests for the mock database functions provided in _DATA.js.
 * Includes tests for _saveQuestion and _saveQuestionAnswer.
 */

import { describe, it, expect } from 'vitest';
import { _saveQuestion, _saveQuestionAnswer } from './utils/_DATA';

describe('_saveQuestion', () => {
  it('should return the saved question and update the database when valid data is passed', async () => {
    const validQuestion = {
      optionOneText: 'Write Integration Tests',
      optionTwoText: 'Write Unit Tests',
      author: 'sarahedo',
    };
    
    const result = await _saveQuestion(validQuestion);
    
    // Check returned object structure
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
    
    await expect(_saveQuestion(invalidQuestion)).rejects.toEqual(
      'Please provide optionOneText, optionTwoText, and author'
    );
  });
});

describe('_saveQuestionAnswer', () => {
  it('should return true and update state when valid answer data is passed', async () => {
    // 1. Create a question first to ensure a valid qid exists in the local state
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
    
    // 2. Test the answer saving
    const result = await _saveQuestionAnswer(validPayload);
    expect(result).toBe(true);
  });

  it('should return an error if the answer payload is incomplete', async () => {
    const invalidPayload = {
      authedUser: 'sarahedo',
      qid: 'any-id',
      // answer field is missing
    };
    
    await expect(_saveQuestionAnswer(invalidPayload)).rejects.toEqual(
      'Please provide authedUser, qid, and answer'
    );
  });
});