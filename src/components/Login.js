/**
 * File: src/components/Login.js
 * Description: 
 * Provides a user interface for selecting a user from the mock database
 * and setting them as the 'authedUser' in the Redux state.
 * * Fixes applied:
 * 1. Resolved 'react-redux' dependency mapping.
 * 2. Updated import path for 'setAuthedUser' to match our Redux Toolkit store structure.
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthedUser } from '../store/index'; // Updated path to the RTK store export

const Login = () => {
  const dispatch = useDispatch();
  
  // Access users from state.users as defined in our store/index.ts slices
  const users = useSelector((state) => state.users);
  const userIds = Object.keys(users || {});

  const [selectedUser, setSelectedUser] = useState('');

  const handleChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      dispatch(setAuthedUser(selectedUser));
    }
  };

  return (
    <div className="login-container" style={styles.container}>
      <div className="login-box" style={styles.box}>
        <h1 style={styles.title}>Employee Polls</h1>
        <h2 style={styles.subtitle}>Please sign in to continue</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="user-select" style={styles.label}>Select User</label>
          <select 
            id="user-select"
            value={selectedUser} 
            onChange={handleChange}
            style={styles.select}
            data-testid="user-select"
          >
            <option value="" disabled>-- Choose a User --</option>
            {userIds.map((id) => (
              <option key={id} value={id}>
                {users[id].name}
              </option>
            ))}
          </select>
          
          <button 
            type="submit" 
            disabled={selectedUser === ''}
            style={selectedUser === '' ? {...styles.button, ...styles.disabled} : styles.button}
            data-testid="login-submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    padding: '20px',
  },
  box: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '20px',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  disabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  }
};

export default Login;