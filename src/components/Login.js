/**
 * File: src/components/Login.js
 * Description: Component for the application's login screen. Allows the user
 * to select an existing user from a dropdown to log in.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleSetAuthedUser } from '../actions/authedUser.js';
import { Navigate } from 'react-router-dom';

class Login extends Component {
  state = {
    userId: '',
    toHome: false, // Flag to indicate successful login and redirect
  };

  /**
   * Handles changes in the dropdown selection.
   * @param {Object} e - The change event object.
   */
  handleChange = (e) => {
    const userId = e.target.value;
    this.setState(() => ({
      userId,
    }));
  };

  /**
   * Handles the submission of the login form.
   * @param {Object} e - The form submission event object.
   */
  handleSubmit = (e) => {
    e.preventDefault();

    const { userId } = this.state;
    const { dispatch } = this.props;

    if (userId !== '') {
      // Dispatch the thunk action to set the authenticated user and hide loading bar
      dispatch(handleSetAuthedUser(userId));
      
      this.setState(() => ({
        toHome: true, // Set flag to redirect to the home page
      }));
    } else {
      console.log('Login failed: Please select a user.');
    }
  };

  render() {
    const { users } = this.props;
    const { userId, toHome } = this.state;
    
    // Redirect to the home page ('/') after successful login
    if (toHome === true) {
      return <Navigate to="/" />;
    }

    return (
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-sm border border-gray-200">
          <header className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Welcome to 'Would You Rather?'</h3>
            <p className="text-sm text-gray-500 mt-1">Please sign in to continue.</p>
          </header>

          <form onSubmit={this.handleSubmit} className="space-y-6">
            <div className="text-center">
              <h4 className="text-lg font-medium text-indigo-600 mb-3">Sign In</h4>
              
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out"
                value={userId}
                onChange={this.handleChange}
                data-testid="user-select"
              >
                <option value="" disabled>
                  Select User
                </option>
                {/* Map over the users prop to create dropdown options */}
                {Object.keys(users).map((id) => (
                  <option key={id} value={id}>
                    {users[id].name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={userId === ''}
              data-testid="login-button"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }
}

/**
 * Maps the users slice of state to props, allowing the component to list users.
 * @param {Object} state - The Redux store state.
 * @returns {Object} The users object.
 */
function mapStateToProps({ users }) {
  return {
    users,
  };
}

// Connect the component to the Redux store
export default connect(mapStateToProps)(Login);
