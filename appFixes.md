# Employee Polls - Application Revisions & Fixes

This document tracks the resolution of issues identified in the project review. Each category is addressed to ensure 100% compliance with requirements.

🏗 ## Phase 0: Foundations & Architectural Enhancements

**Status:** In Progress

We are starting with these high-level improvements to ensure the application is stable and scalable before fixing specific functional bugs.

[ ] **Redux Toolkit (RTK) Refactor:** Transitioning from legacy Redux to createSlice and configureStore for more predictable state updates.

[ ] **TypeScript Integration:** Implementing strict type definitions for Users, Polls, and Store State to catch errors during development.

[ ] **Vite Migration:** Updating the build tool to Vite for improved development speed and modern ESM support.

## Project Requirement Categories

### Application Setup

[ ] **README Update:** Add clear installation instructions _(clone, npm install, npm start)_.

[ ] **Project Initiation:** Document the process for cloning and initiating the environment.

### Login Flow

[ ] **Authentication Guard:** Ensure users are prompted to login before accessing any requested URL.

[ ] **User Impersonation:** Verify functionality regardless of the user selected from _DATA.js.

[ ] **Session Management:** Ensure logout returns the user to the login screen and clears state.

### Application Functionality

[ ] **Leaderboard Route:** Move leaderboard to the explicit /leaderboard path.

[ ] **Dashboard Toggle:** Implement a toggle to alternate between _"Unanswered"_ and _"Answered"_ polls.

[ ] **Poll Details _(/questions/:question_id)_:** Ensure correct data display and clear marking of the user's selection.

[ ] **404 Handling:** Ensure non-existent polls trigger a 404 page after login check.

[ ] **New Poll Route:** Relocate the creation form to /add.

[ ] **Form Validation:** Disable submit for empty fields and ensure unique options.

[ ] **Global Navigation:** Ensure the Nav Bar is visible and functional on all pages.

### Architecture

[ ] **State Management:** Confirm all global state is managed via the Redux store.

[ ] **Modular Structure:** Maintain component decomposition during refactoring.

### Unit Testing

[ ] **Test Coverage:** Ensure at least 15 passing unit tests.

[ ] **fireEvent Interaction:** Verify UI changes using fireEvent.

[ ] **Data Logic Tests:**

[ ] **_saveQuestion():** Test for success and failure cases.

[ ] **_saveQuestionAnswer():** Test for success and failure cases.

[ ] **Snapshot Testing:** Integrate toMatchSnapshot() for UI consistency.

[ ] **Test Command:** Update package.json for npm start test execution.

**Status:** Initializing Architectural Refactor _(RTK & TypeScript)_.
