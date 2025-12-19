/**
 * File: src/components/UnansweredPoll.js
 * Description: Component displayed for polls the authenticated user has NOT yet answered.
 * Contains the voting form and submits the answer using the Redux thunk.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleAddAnswer } from '../actions/questions.js';

class UnansweredPoll extends Component {
  state = {
    selectedOption: '', // 'optionOne' or 'optionTwo'
  };

  handleChange = (e) => {
    this.setState({
      selectedOption: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { selectedOption } = this.state;
    const { dispatch, question } = this.props;

    if (selectedOption) {
      // Dispatch the thunk to save the answer to the API and update the store
      dispatch(handleAddAnswer(question.id, selectedOption));
      
      // The parent component (PollPage) will automatically switch to the Results view 
      // because the user's answer will update in the Redux store.
    } else {
      console.warn('Please select an option before submitting.');
    }
  };

  render() {
    const { question, author } = this.props;
    const { selectedOption } = this.state;
    
    if (!question || !author) {
      return null;
    }

    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg mx-auto">
        
        {/* Author Header */}
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 text-center">
            {author.name} asks:
          </h2>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
            Would You Rather...
          </h1>

          <form onSubmit={this.handleSubmit} className="space-y-4">
            
            {/* Option One */}
            <label className={`block border-2 p-4 rounded-lg cursor-pointer transition-colors duration-150 ${selectedOption === 'optionOne' ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-indigo-400'}`}>
              <input
                type="radio"
                name="answer"
                value="optionOne"
                checked={selectedOption === 'optionOne'}
                onChange={this.handleChange}
                className="mr-3 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-lg font-medium text-gray-700">
                {question.optionOne.text}
              </span>
            </label>

            {/* Option Two */}
            <label className={`block border-2 p-4 rounded-lg cursor-pointer transition-colors duration-150 ${selectedOption === 'optionTwo' ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-indigo-400'}`}>
              <input
                type="radio"
                name="answer"
                value="optionTwo"
                checked={selectedOption === 'optionTwo'}
                onChange={this.handleChange}
                className="mr-3 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-lg font-medium text-gray-700">
                {question.optionTwo.text}
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedOption}
              className="w-full mt-6 py-3 px-4 rounded-lg text-white font-bold text-xl bg-green-600 hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl"
            >
              Submit Answer
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// We connect to get access to the dispatch function via props
export default connect()(UnansweredPoll);