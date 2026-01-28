/**
 * FILE: src/utils/_DATA.ts
 * DESCRIPTION:
 * Updated mock database to export clean function names 
 * for use in Redux thunks.
 */

let users: any = {
  sarahedo: {
    id: 'sarahedo',
    password: 'password123',
    name: 'Sarah Edo',
    avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    answers: {
      "8xf0y6ziyjabvozdd253nd": 'optionOne',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo',
      "am8e62niez7L235cj38": 'optionTwo',
      "loxhs1bqm25b708cmbf3g": 'optionTwo'
    },
    questions: ['8xf0y6ziyjabvozdd253nd', 'am8e62niez7L235cj38']
  },
  tylermcginnis: {
    id: 'tylermcginnis',
    password: 'password123',
    name: 'Tyler McGinnis',
    avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler',
    answers: {
      "vthrdm985a262al8qx3p": 'optionOne',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo',
    },
    questions: ['loxhs1bqm25b708cmbf3g', 'vthrdm985a262al8qx3p'],
  },
  johndoe: {
    id: 'johndoe',
    password: 'password123',
    name: 'John Doe',
    avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    answers: {
      "xj352vkh75pqbwqbfxaq": 'optionOne',
      "vthrdm985a262al8qx3p": 'optionTwo',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo'
    },
    questions: ['6ni6ok3ym7mf1p33lnez', 'xj352vkh75pqbwqbfxaq'],
  }
};

let questions: any = {
  "8xf0y6ziyjabvozdd253nd": {
    id: '8xf0y6ziyjabvozdd253nd',
    author: 'sarahedo',
    timestamp: 1467166872634,
    optionOne: {
      votes: ['sarahedo'],
      text: 'Build our new site with Skeleton',
    },
    optionTwo: {
      votes: [],
      text: 'Build our new site with Bootstrap',
    }
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: '6ni6ok3ym7mf1p33lnez',
    author: 'johndoe',
    timestamp: 1468479767190,
    optionOne: {
      votes: [],
      text: 'become a front-end developer',
    },
    optionTwo: {
      votes: ['johndoe', 'sarahedo', 'tylermcginnis'],
      text: 'become a back-end developer'
    }
  },
  "am8e62niez7L235cj38": {
    id: 'am8e62niez7L235cj38',
    author: 'sarahedo',
    timestamp: 1488579767190,
    optionOne: {
      votes: [],
      text: 'find $50 tomorrow',
    },
    optionTwo: {
      votes: ['sarahedo'],
      text: 'learn a new programming language'
    }
  },
  "loxhs1bqm25b708cmbf3g": {
    id: 'loxhs1bqm25b708cmbf3g',
    author: 'tylermcginnis',
    timestamp: 1482579767190,
    optionOne: {
      votes: [],
      text: 'be a professional sleeper',
    },
    optionTwo: {
      votes: ['sarahedo', 'tylermcginnis'],
      text: 'be a professional explorer'
    }
  },
  "vthrdm985a262al8qx3p": {
    id: 'vthrdm985a262al8qx3p',
    author: 'tylermcginnis',
    timestamp: 1489579767190,
    optionOne: {
      votes: ['tylermcginnis'],
      text: 'hire more engineers',
    },
    optionTwo: {
      votes: ['johndoe'],
      text: 'expand to a new office'
    }
  },
  "xj352vkh75pqbwqbfxaq": {
    id: 'xj352vkh75pqbwqbfxaq',
    author: 'johndoe',
    timestamp: 1493579767190,
    optionOne: {
      votes: ['johndoe'],
      text: 'conduct a user study',
    },
    optionTwo: {
      votes: [],
      text: 'launch a marketing campaign'
    }
  }
};

function generateUID () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function _getUsers () {
  return new Promise((res) => {
    setTimeout(() => res({...users}), 1000);
  });
}

export function _getQuestions () {
  return new Promise((res) => {
    setTimeout(() => res({...questions}), 1000);
  });
}

function formatQuestion ({ optionOneText, optionTwoText, author }: any) {
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

export function _saveQuestion (question: any) {
  return new Promise((res) => {
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

export function _saveQuestionAnswer ({ authedUser, qid, answer }: any) {
  return new Promise<void>((res) => {
    setTimeout(() => {
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
          [answer]: {
            ...questions[qid][answer],
            votes: questions[qid][answer].votes.concat([authedUser])
          }
        }
      };

      res();
    }, 500);
  });
}

/**
 * PUBLIC API (Clean names for shared actions)
 */
export const getInitialData = () => {
  return Promise.all([
    _getUsers(),
    _getQuestions(),
  ]).then(([users, questions]) => ({
    users,
    questions,
  }));
};

export const saveQuestion = _saveQuestion;
export const saveQuestionAnswer = _saveQuestionAnswer;