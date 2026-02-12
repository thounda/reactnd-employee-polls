/**
FILE: _DATA.test.ts
PATH: src/utils/_DATA.test.ts
DESCRIPTION: Unit tests for the mock database methods.
Verifies that data is saved correctly and that error handling is triggered for invalid inputs.
*/

import { describe, it, expect } from 'vitest';
import { saveQuestion, saveQuestionAnswer } from './_DATA';

describe('saveQuestion', () => {
it('should return the formatted question when valid data is passed', async () => {
const validQuestion = {
optionOneText: 'Option 1',
optionTwoText: 'Option 2',
author: 'sarahedo',
};

const result = await saveQuestion(validQuestion);

// Verify properties of the formatted question
expect(result).toHaveProperty('id');
expect(result).toHaveProperty('timestamp');
expect(result.optionOne.text).toBe('Option 1');
expect(result.optionTwo.text).toBe('Option 2');
expect(result.author).toBe('sarahedo');


});

it('should throw an error if required fields are missing', async () => {
const invalidQuestion = {
optionOneText: '', // Missing text
optionTwoText: 'Option 2',
author: 'sarahedo',
};

// Verify the promise rejects with the specific error message from _DATA.ts
await expect(saveQuestion(invalidQuestion as any)).rejects.toEqual(
  "Please provide optionOneText, optionTwoText, and author"
);


});
});

describe('saveQuestionAnswer', () => {
it('should resolve (return undefined) when all valid fields are passed', async () => {
// Uses existing IDs from the users and questions state in _DATA.ts
const validAnswer = {
authedUser: 'sarahedo',
qid: 'vthrdm985a262al8qx3p',
answer: 'optionOne',
};

// Verifies the async operation completes successfully
await expect(saveQuestionAnswer(validAnswer as any)).resolves.toBeUndefined();


});

it('should throw an error if an incorrect format is passed', async () => {
const invalidAnswer = {
authedUser: 'sarahedo',
qid: '', // Missing Question ID
answer: 'optionOne',
};

// Verify the promise rejects with the specific error message from _DATA.ts
await expect(saveQuestionAnswer(invalidAnswer as any)).rejects.toEqual(
  "Please provide authedUser, qid, and answer"
);


});
});