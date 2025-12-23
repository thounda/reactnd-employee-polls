/**
 * FILE: src/_DATA.test.js
 * * DESCRIPTION:
 * This file contains unit tests for the data layer logic in _DATA.js. 
 * It verifies that:
 * 1. _saveQuestion returns a correctly formatted question object with valid inputs.
 * 2. _saveQuestion rejects with an error message when required fields are missing.
 * 3. _saveQuestionAnswer returns true when a valid answer is submitted.
 * 4. _saveQuestionAnswer rejects with an error message when the payload is incomplete.
 * * These tests ensure the reliability of the application's data manipulation functions.
 */

import { describe, it, expect } from 'vitest';
import { _saveQuestion, _saveQuestionAnswer } from './utils/_DATA';

describe('_saveQuestion', () => {
    it('should return the formatted question and all expected fields when correctly formatted data is passed', async () => {
        const mockQuestion = {
            optionOneText: 'Eat an apple',
            optionTwoText: 'Eat an orange',
            author: 'sarahedo'
        };
        const result = await _saveQuestion(mockQuestion);
        
        expect(result.author).toEqual('sarahedo');
        expect(result.optionOne.text).toEqual('Eat an apple');
        expect(result.optionTwo.text).toEqual('Eat an orange');
        expect(result.id).toBeDefined();
        expect(result.timestamp).toBeDefined();
    }, 10000); 

    it('should return an error if incorrect data is passed to the function', async () => {
        const incompleteQuestion = {
            optionOneText: 'Missing other fields',
            author: 'sarahedo'
        };
        await expect(_saveQuestion(incompleteQuestion)).rejects.toEqual(
            'Please provide optionOneText, optionTwoText, and author'
        );
    });
});

describe('_saveQuestionAnswer', () => {
    it('should return true when correctly formatted data is passed', async () => {
        const mockAnswer = {
            authedUser: 'sarahedo',
            qid: '8xf0y6ziyjabvozdd253nd',
            answer: 'optionOne'
        };
        const result = await _saveQuestionAnswer(mockAnswer);
        expect(result).toBe(true);
    });

    it('should return an error if incorrect data is passed to the function', async () => {
        const incompleteAnswer = {
            authedUser: 'sarahedo',
            qid: '8xf0y6ziyjabvozdd253nd'
            // answer field is intentionally missing for this test case
        };
        await expect(_saveQuestionAnswer(incompleteAnswer)).rejects.toEqual(
            'Please provide authedUser, qid, and answer'
        );
    });
});