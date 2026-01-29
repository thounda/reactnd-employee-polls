/**

FILE: src/utils/_DATA.ts

DESCRIPTION:

Updated mock database using physical image paths for user avatars

and the specific user profiles provided.
*/

let users: any = {
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
author: 'mtsamis',
timestamp: 1468479767190,
optionOne: {
votes: ['mtsamis', 'sarahedo'],
text: 'become a front-end developer',
},
optionTwo: {
votes: [],
text: 'become a back-end developer'
}
},
"am8ehyc8byjqgar0jgpub9": {
id: 'am8ehyc8byjqgar0jgpub9',
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
"vthrdm985a262al8qx3do": {
id: 'vthrdm985a262al8qx3do',
author: 'tylermcginnis',
timestamp: 1489579767190,
optionOne: {
votes: ['tylermcginnis'],
text: 'hire more engineers',
},
optionTwo: {
votes: ['mtsamis'],
text: 'expand to a new office'
}
},
"xj352vofupe1dqz9emx13r": {
id: 'xj352vofupe1dqz9emx13r',
author: 'mtsamis',
timestamp: 1493579767190,
optionOne: {
votes: ['mtsamis', 'zoshikanlu'],
text: 'conduct a user study',
},
optionTwo: {
votes: ['tylermcginnis'],
text: 'launch a marketing campaign'
}
}
};

function generateUID () {
return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function _getUsers () {
return new Promise((res) => {
setTimeout(() => res({...users}), 500);
});
}

export function _getQuestions () {
return new Promise((res) => {
setTimeout(() => res({...questions}), 500);
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
}, 500);


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