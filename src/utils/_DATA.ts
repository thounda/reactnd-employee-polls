/**
 * FILE: _DATA.ts
 * PATH: src/utils/_DATA.ts
 * DESCRIPTION:
 * Mock database providing initial state for users and questions. 
 * Includes methods to simulate asynchronous API calls for data fetching and persistence.
 */

import { 
  User, 
  Question, 
  UsersState, 
  QuestionsState, 
  SaveQuestionPayload, 
  AnswerPayload 
 } from '../slices/types';

/**
 * Initial mock data for users.
 * Uses local file paths for avatars.
 */
export let users: UsersState = {
  sarahedo: {
    id: 'sarahedo',
    name: 'Sarah Edo',
    avatarURL: '/avatars/sarahedo.png',
    answers: {
      "8xf0y6ziyj7av7624brz": 'optionOne',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo',
      "am8ehyc8byjqca69nzmx": 'optionTwo'
    },
    questions: ['8xf0y6ziyj7av7624brz', 'am8ehyc8byjqca69nzmx']
  },
  tylermcginnis: {
    id: 'tylermcginnis',
    name: 'Tyler McGinnis',
    avatarURL: '/avatars/tylermcginnis.png',
    answers: {
      "vthrdm985a262al8qx3p": 'optionOne',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo',
    },
    questions: ['loxhs1bqm25b708cmbf3', 'vthrdm985a262al8qx3p'],
  },
  mtsamis: {
    id: 'mtsamis',
    name: 'Mike Tsamis',
    avatarURL: '/avatars/mtsamis.png',
    answers: {
      "xj352vkh65vdn9lffv8": 'optionOne',
      "vthrdm985a262al8qx3p": 'optionTwo',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo'
    },
    questions: ['6ni6ok3ym7mf1p33lnez', 'xj352vkh65vdn9lffv8'],
  },
  zoshikanlu: {
    id: 'zoshikanlu',
    name: 'Zenobi Oshikanlu',
    avatarURL: '/avatars/zoshikanlu.png',
    answers: {
      "xj352vkh65vdn9lffv8": 'optionOne'
    },
    questions: [],
  }
};

/**
 * Initial mock data for questions.
 */
export let questions: QuestionsState = {
  "8xf0y6ziyj7av7624brz": {
    id: '8xf0y6ziyj7av7624brz',
    author: 'sarahedo',
    timestamp: 1467166872634,
    optionOne: {
      votes: ['sarahedo'],
      text: 'Have horrible short term memory',
    },
    optionTwo: {
      votes: [],
      text: 'Have horrible long term memory'
    }
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: '6ni6ok3ym7mf1p33lnez',
    author: 'mtsamis',
    timestamp: 1468479767190,
    optionOne: {
      votes: [],
      text: 'Become a superhero',
    },
    optionTwo: {
      votes: ['mtsamis', 'sarahedo', 'tylermcginnis'],
      text: 'Become a supervillain'
    }
  },
  "am8ehyc8byjqca69nzmx": {
    id: 'am8ehyc8byjqca69nzmx',
    author: 'sarahedo',
    timestamp: 1479427192905,
    optionOne: {
      votes: [],
      text: 'Be telekinetic',
    },
    optionTwo: {
      votes: ['sarahedo'],
      text: 'Be invisible'
    }
  },
  "loxhs1bqm25b708cmbf3": {
    id: 'loxhs1bqm25b708cmbf3',
    author: 'tylermcginnis',
    timestamp: 1482579767190,
    optionOne: {
      votes: [],
      text: 'Be a front-end developer',
    },
    optionTwo: {
      votes: [],
      text: 'Be a back-end developer'
    }
  },
  "vthrdm985a262al8qx3p": {
    id: 'vthrdm985a262al8qx3p',
    author: 'tylermcginnis',
    timestamp: 1484339767190,
    optionOne: {
      votes: ['tylermcginnis'],
      text: 'Find $50 yourself',
    },
    optionTwo: {
      votes: ['mtsamis'],
      text: 'Have your best friend find $500'
    }
  },
  "xj352vkh65vdn9lffv8": {
    id: 'xj352vkh65vdn9lffv8',
    author: 'mtsamis',
    timestamp: 1493579767190,
    optionOne: {
      votes: ['mtsamis', 'zoshikanlu'],
      text: 'Write JavaScript',
    },
    optionTwo: {
      votes: [],
      text: 'Write Swift'
    }
  },
};

/**
 * Generates a unique ID for new questions.
 */
function generateUID(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Fetches all users from the mock database.
 */
export function _getUsers(): Promise<UsersState> {
  return new Promise((res) => {
    setTimeout(() => res({ ...users }), 1000);
  });
}

/**
 * Fetches all questions from the mock database.
 */
export function _getQuestions(): Promise<QuestionsState> {
  return new Promise((res) => {
    setTimeout(() => res({ ...questions }), 1000);
  });
}

/**
 * Helper used by the Redux slices to fetch both datasets simultaneously.
 */
export function getInitialData(): Promise<{ users: UsersState, questions: QuestionsState }> {
  return Promise.all([
    _getUsers(),
    _getQuestions(),
  ]).then(([u, q]) => ({
    users: u,
    questions: q,
  }));
}

/**
 * Formats data into a valid Question object before "storing" it.
 */
function formatQuestion({ optionOneText, optionTwoText, author }: SaveQuestionPayload): Question {
  return {
    id: generateUID(),
    timestamp: Date.now(),
    author,
    optionOne: {
      votes: [],
      text: optionOneText,
    },
    optionTwo: {
      votes: [],
      text: optionTwoText,
    }
  };
}

/**
 * Persists a new question and updates the associated user's list of questions.
 */
export function saveQuestion(question: SaveQuestionPayload): Promise<Question> {
  return new Promise((res, rej) => {
    // GUARD CLAUSE: Validate synchronously before starting timer
    if (!question.author || !question.optionOneText || !question.optionTwoText) {
      return rej("Please provide optionOneText, optionTwoText, and author");
    }

    const authedUser = question.author;
    const formattedQuestion = formatQuestion(question);

    setTimeout(() => {
      questions = {
        ...questions,
        [formattedQuestion.id]: formattedQuestion
      };

      users = {
        ...users,
        [authedUser]: {
          ...users[authedUser],
          questions: users[authedUser].questions.concat([formattedQuestion.id])
        }
      };

      res(formattedQuestion);
    }, 1000);
  });
}

/**
 * Persists a user's answer to a poll and updates the question's vote records.
 */
export function saveQuestionAnswer({ authedUser, qid, answer }: AnswerPayload): Promise<void> {
  return new Promise((res, rej) => {
    // GUARD CLAUSE: Validate synchronously before starting timer
    if (!authedUser || !qid || !answer) {
      return rej("Please provide authedUser, qid, and answer");
    }

    // EXTRA SAFETY: Ensure the data we are about to update actually exists
    if (!users[authedUser] || !questions[qid]) {
      return rej("User or Question does not exist");
    }

    setTimeout(() => {
      const voteKey = answer as 'optionOne' | 'optionTwo';

      users = {
        ...users,
        [authedUser]: {
          ...users[authedUser],
          answers: {
            ...users[authedUser].answers,
            [qid]: answer
          }
        }
      };

      questions = {
        ...questions,
        [qid]: {
          ...questions[qid],
          [voteKey]: {
            ...questions[qid][voteKey],
            votes: questions[qid][voteKey].votes.concat([authedUser])
          }
        }
      };

      res();
    }, 500);
  });
}