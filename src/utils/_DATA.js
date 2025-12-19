/**
 * @description This file simulates a backend database for the Employee Polls application.
 * It provides methods to fetch users, fetch questions, save new questions,
 * and save answers to questions.
 *
 * NOTE: This uses static data. The avatarURL paths assume images are located in the /public/avatars folder.
 */

let users = {
  sarahedo: {
    id: 'sarahedo',
    password: 'password123',
    name: 'Sarah Edo',
    avatarURL: '/avatars/sarahedo.png',
    answers: {
      "8xf0y6ziyjabvozdd253nd": 'optionOne',
      "6ni6ok3ym7mf1p33lnez": 'optionOne',
      "am8ehyc8byjqgar0jgpub9": 'optionTwo',
      "loxhs1bqm25b708cmbf3g": 'optionTwo'
    },
    questions: ['8xf0y6ziyjabvozdd253nd', 'am8ehyc8byjqgar0jgpub9']
  },
  tylermcginnis: {
    id: 'tylermcginnis',
    password: 'abc321',
    name: 'Tyler McGinnis',
    avatarURL: '/avatars/tylermcginnis.png',
    answers: {
      "vthrdm985a262al8qx3do": 'optionOne',
      "xj352vofupe1dqz9emx13r": 'optionTwo',
    },
    questions: ['loxhs1bqm25b708cmbf3g', 'vthrdm985a262al8qx3do'],
  },
  mtsamis: {
    id: 'mtsamis',
    password: 'xyz123',
    name: 'Mike Tsamis',
    avatarURL: '/avatars/mtsamis.png',
    answers: {
      "xj352vofupe1dqz9emx13r": 'optionOne',
      "vthrdm985a262al8qx3do": 'optionTwo',
      "6ni6ok3ym7mf1p33lnez": 'optionOne'
    },
    questions: ['6ni6ok3ym7mf1p33lnez', 'xj352vofupe1dqz9emx13r'],
  },
  zoshikanlu: {
    id: 'zoshikanlu',
    password: 'pass246',
    name: 'Zenobia Oshikanlu',
    avatarURL: '/avatars/zoshikanlu.png',
    answers: {
      "xj352vofupe1dqz9emx13r": 'optionOne',
    },
    questions: [],
  }
}

let questions = {
  "8xf0y6ziyjabvozdd253nd": {
    id: '8xf0y6ziyjabvozdd253nd',
    author: 'sarahedo',
    timestamp: 1467166872634,
    optionOne: {
      votes: ['sarahedo'],
      text: 'Build our new application with Javascript',
    },
    optionTwo: {
      votes: [],
      text: 'Build our new application with Typescript'
    }
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: '6ni6ok3ym7mf1p33lnez',
    author: 'mtsamis',
    timestamp: 1468479767190,
    optionOne: {
      votes: ['mtsamis', 'sarahedo'],
      text: 'hire more frontend developers',
    },
    optionTwo: {
      votes: [],
      text: 'hire more backend developers'
    }
  },
  "am8ehyc8byjqgar0jgpub9": {
    id: 'am8ehyc8byjqgar0jgpub9',
    author: 'sarahedo',
    timestamp: 1488579767190,
    optionOne: {
      votes: [],
      text: 'conduct a release retrospective 1 week after a release',
    },
    optionTwo: {
      votes: ['sarahedo'],
      text: 'conduct release retrospectives quarterly'
    }
  },
  "loxhs1bqm25b708cmbf3g": {
    id: 'loxhs1bqm25b708cmbf3g',
    author: 'tylermcginnis',
    timestamp: 1482579767190,
    optionOne: {
      votes: [],
      text: 'have code reviews conducted by peers',
    },
    optionTwo: {
      votes: ['sarahedo'],
      text: 'have code reviews conducted by managers'
    }
  },
  "vthrdm985a262al8qx3do": {
    id: 'vthrdm985a262al8qx3do',
    author: 'tylermcginnis',
    timestamp: 1489579767190,
    optionOne: {
      votes: ['tylermcginnis'],
      text: 'take a course on ReactJS',
    },
    optionTwo: {
      votes: ['mtsamis'],
      text: 'take a course on unit testing with Jest'
    }
  },
  "xj352vofupe1dqz9emx13r": {
    id: 'xj352vofupe1dqz9emx13r',
    author: 'mtsamis',
    timestamp: 1493579767190,
    optionOne: {
      votes: ['mtsamis', 'zoshikanlu'],
      text: 'deploy to production once every two weeks',
    },
    optionTwo: {
      votes: ['tylermcginnis'],
      text: 'deploy to production once every month'
    }
  },
}

function generateUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * @description Simple sanitization function to remove or encode potentially malicious HTML/scripts.
 * This simulates a secure backend behavior.
 * @param {string} input - The raw user input string.
 * @returns {string} The sanitized string.
 */
function sanitizeInput(input) {
  if (!input) return '';
  // Simple regex to remove script tags and common event handlers
  let sanitized = input.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
  // Encode other potentially dangerous characters
  sanitized = sanitized.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;')
                       .replace(/"/g, '&quot;')
                       .replace(/'/g, '&#x27;');
  return sanitized.trim();
}

// --- API FUNCTIONS ---

/**
 * @description Simulates fetching all user records from the database.
 * @returns {Promise<Object>} Object containing all user records.
 */
export function _getUsers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...users}), 1000)
  })
}

/**
 * @description Simulates fetching all question records from the database.
 * @returns {Promise<Object>} Object containing all question records.
 */
export function _getQuestions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...questions}), 1000)
  })
}

/**
 * @description Fetches all users and all questions in a single promise chain.
 * This is the function called by the initial data action creator.
 * @returns {Promise<{users: Object, questions: Object}>}
 */
export function getInitialData() {
  return Promise.all([
    _getUsers(),
    _getQuestions(),
  ]).then(([users, questions]) => ({
    users,
    questions,
  }));
}

function formatQuestion({
  optionOneText,
  optionTwoText,
  author
}) {
  return {
    id: generateUID(),
    timestamp: Date.now(),
    author,
    optionOne: {
      votes: [],
      // SANITIZE INPUT before formatting
      text: sanitizeInput(optionOneText),
    },
    optionTwo: {
      votes: [],
      // SANITIZE INPUT before formatting
      text: sanitizeInput(optionTwoText),
    }
  }
}

/**
 * @description Saves a new question to the database and updates the user who posted it.
 * @param {Object} question - Object containing optionOneText, optionTwoText, and author.
 * @returns {Promise<Object>} The newly formatted question object.
 */
export function _saveQuestion(question) {
  return new Promise((resolve, reject) => {
    if (!question.optionOneText || !question.optionTwoText || !question.author) {
      reject("Please provide optionOneText, optionTwoText, and author");
    }

    const authedUser = question.author;
    // The formatQuestion call now internally sanitizes the text
    const formattedQuestion = formatQuestion(question) 
    
    setTimeout(() => {
      // 1. Update questions
      questions = {
        ...questions,
        [formattedQuestion.id]: formattedQuestion
      }

      // 2. Update users (Crucial addition to keep the "database" in sync)
      users = {
        ...users,
        [authedUser]: {
          ...users[authedUser],
          questions: users[authedUser].questions.concat([formattedQuestion.id]),
        }
      }

      resolve(formattedQuestion)
    }, 1000)
  })
}

/**
 * @description Saves a user's answer to a question.
 * @param {Object} info - Object containing authedUser, qid (question ID), and answer (optionOne or optionTwo).
 * @returns {Promise<boolean>}
 */
export function _saveQuestionAnswer({
  authedUser,
  qid,
  answer
}) {
  return new Promise((resolve, reject) => {
    if (!authedUser || !qid || !answer) {
      reject("Please provide authedUser, qid, and answer");
    }

    setTimeout(() => {
      // 1. Update users
      users = {
        ...users,
        [authedUser]: {
          ...users[authedUser],
          answers: {
            ...users[authedUser].answers,
            [qid]: answer
          }
        }
      }

      // 2. Update questions
      questions = {
        ...questions,
        [qid]: {
          ...questions[qid],
          [answer]: {
            ...questions[qid][answer],
            votes: questions[qid][answer].votes.concat([authedUser])
          }
        }
      }

      resolve(true)
    }, 500)
  })
}