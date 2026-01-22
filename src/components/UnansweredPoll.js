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
    selectedOption: '', // Tracks 'optionOne' or 'optionTwo'
    isSubmitting: false, // Local state for UI feedback during async dispatch
  };

  /**
   * Updates local state when a radio option is selected.
   */
  handleChange = (e) => {
    this.setState({
      selectedOption: e.target.value,
    });
  };

  /**
   * Dispatches the voting action to Redux.
   * On success, the store update triggers a re-render in PollPage.js,
   * which will then switch to the results view.
   */
  handleSubmit = async (e) => {
    e.preventDefault();

    const { selectedOption } = this.state;
    const { dispatch, question } = this.props;

    if (selectedOption) {
      this.setState({ isSubmitting: true });
      
      try {
        // Dispatching the thunk defined in ../actions/questions.js
        await dispatch(handleAddAnswer(question.id, selectedOption));
      } catch (error) {
        console.error('Error submitting answer:', error);
        // Re-enable button on error to allow retry
        this.setState({ isSubmitting: false });
      }
    }
  };

  render() {
    const { question, author } = this.props;
    const { selectedOption, isSubmitting } = this.state;
    
    // Safety check for data availability
    if (!question || !author) {
      return null;
    }

    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg mx-auto border border-gray-100">
        
        {/* Author Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 text-center">
            {author.name} asks:
          </h2>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
             <h1 className="text-3xl font-black text-indigo-900 text-center italic tracking-tight">
              Would You Rather...
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded-full mt-2"></div>
          </div>

          <form onSubmit={this.handleSubmit} className="space-y-4">
            
            {/* Option One Selection */}
            <label className={`group block border-2 p-5 rounded-xl cursor-pointer transition-all duration-200 ${selectedOption === 'optionOne' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 shadow-inner' : 'border-gray-100 hover:border-indigo-300 hover:bg-gray-50'}`}>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${selectedOption === 'optionOne' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                  {selectedOption === 'optionOne' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <input
                  type="radio"
                  name="answer"
                  value="optionOne"
                  checked={selectedOption === 'optionOne'}
                  onChange={this.handleChange}
                  className="hidden"
                />
                <span className={`text-lg font-semibold transition-colors ${selectedOption === 'optionOne' ? 'text-indigo-900' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  {question.optionOne.text}
                </span>
              </div>
            </label>

            <div className="flex items-center justify-center my-2">
              <span className="bg-white px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
            </div>

            {/* Option Two Selection */}
            <label className={`group block border-2 p-5 rounded-xl cursor-pointer transition-all duration-200 ${selectedOption === 'optionTwo' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 shadow-inner' : 'border-gray-100 hover:border-indigo-300 hover:bg-gray-50'}`}>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${selectedOption === 'optionTwo' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                  {selectedOption === 'optionTwo' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <input
                  type="radio"
                  name="answer"
                  value="optionTwo"
                  checked={selectedOption === 'optionTwo'}
                  onChange={this.handleChange}
                  className="hidden"
                />
                <span className={`text-lg font-semibold transition-colors ${selectedOption === 'optionTwo' ? 'text-indigo-900' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  {question.optionTwo.text}
                </span>
              </div>
            </label>

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={!selectedOption || isSubmitting}
              className={`w-full mt-8 py-4 px-6 rounded-xl text-white font-black text-xl tracking-wide uppercase transition-all duration-300 shadow-lg ${
                !selectedOption || isSubmitting 
                ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-200 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Submit Choice'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// Connect provides access to the dispatch function
export default connect()(UnansweredPoll);