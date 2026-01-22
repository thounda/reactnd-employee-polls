/**
 * File: src/components/PollPage.js
 * Description: Displays poll details, voting interface, or results.
 */
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Avatar from "./Avatar.js";
import UnansweredPoll from "./UnansweredPoll.js";    
import NotFound from "./NotFound.js";

/**
 * AnsweredPollResults Component
 * Renders the results of a poll that the user has already voted on.
 */
function AnsweredPollResults({ question, author, authedUserAnswer }) {
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  
  const calculatePercent = (votes) => {
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center mb-6 pb-4 border-b">
        <Avatar url={author.avatarURL} name={author.name} size="lg" />
        <div className="ml-4 text-left">
          <h2 className="text-xl font-bold text-gray-800">Asked by {author.name}</h2>
          <p className="text-gray-500">Poll Results</p>
        </div>
      </div>

      <div className="space-y-4">
        {['optionOne', 'optionTwo'].map((optionKey) => {
          const option = question[optionKey];
          const isSelected = authedUserAnswer === optionKey;
          const votes = option.votes.length;
          const percent = calculatePercent(votes);

          return (
            <div 
              key={optionKey} 
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {isSelected && (
                <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white bg-indigo-500 rounded-full">
                  Your Vote
                </span>
              )}
              <p className="text-lg font-medium text-gray-800 mb-2">{option.text}</p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600 font-semibold">
                <span>{votes} {votes === 1 ? 'vote' : 'votes'}</span>
                <span>{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PollPage Component
 * Main container for a specific poll route.
 */
function PollPage() {
  const { question_id } = useParams();
  const authedUser = useSelector((state) => state.authedUser);
  const questions = useSelector((state) => state.questions);
  const users = useSelector((state) => state.users);

  const question = questions[question_id];

  // If the question ID is invalid, redirect to the custom NotFound component
  if (!question) {
    return <NotFound />;
  }

  const author = users[question.author];
  const authedUserAnswer = (question.optionOne.votes.includes(authedUser)) 
    ? 'optionOne' 
    : (question.optionTwo.votes.includes(authedUser)) 
      ? 'optionTwo' 
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {authedUserAnswer ? (
        <AnsweredPollResults 
          question={question} 
          author={author} 
          authedUserAnswer={authedUserAnswer} 
        />
      ) : (
        <UnansweredPoll question={question} author={author} />
      )}
    </div>
  );
}

export default PollPage;