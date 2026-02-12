# Employee Polls - Corporate Decision Ecosystem

A high-fidelity React application built for internal community engagement. This project allows employees to post "Would You Rather" polls, vote on inquiries, and track engagement through a ranked leaderboard.

[![React Employee Poll App](/public/employee-polls.png "React Employee Poll Application")](https://github.com/thounda/reactnd-employee-polls/blob/master/public/employee-polls.png)

## 🚀 Key Features

- **Authenticated Access:** Secure login system utilizing a mock database of corporate identities.

- **Categorized Dashboard:** Smart filtering between "New Questions" and "Answered Polls."

- **Interactive Voting:** Real-time percentage breakdowns and vote counts for community inquiries.

- **Dynamic Leaderboard:** Advanced ranking algorithm based on a combined score of questions created and answers submitted.

- **Responsive Podium:** Custom visual hierarchy for the top three community contributors.

## 🛠 Tech Stack & Architecture

### Core Technologies

- **Vite:** Utilized as the build tool for lightning-fast Hot Module Replacement (HMR) and optimized production bundling.

- **TypeScript:** Implemented across the entire codebase to ensure type safety, reduce runtime errors, and improve developer experience.

- **Redux Toolkit (RTK):** Manages the global state. The store acts as a single source of truth for users and questions, utilizing slices for clean, maintainable logic.

### Authentication & Security

- **Protected Routes:** A custom ProtectedRoute wrapper ensures that users cannot access the Dashboard, Leaderboard, or Poll details without an active session.

- **Session Persistence:** The system tracks the authedUser in the Redux state, redirecting unauthorized attempts back to the Login portal.

## 💻 Local Setup Instructions

Follow these steps to set up the project in your local development environment:

1. **Clone the Repository**

   git clone [https://github.com/thounda/reactnd-employee-polls.git](https://github.com/thounda/reactnd-employee-polls.git)

   cd reactnd-employee-polls

2. **Install Dependencies**

    npm install

3. **Launch Development Server**

    npm run dev

   The app will be available at <http://localhost:5173>.

## 🧪 Testing Suite

Vite maintain a rigorous testing standard using Vitest and React Testing Library. The suite covers UI rendering, state transitions, and business logic.

### Running All Tests

    To run the entire test suite simultaneously:

        npx vitest

### Targeted Component Tests

You can also run specific test suites for individual modules:

| **Target Component** | **Command** |
| --- | --- |
| **Global App / Routing** | Ronpx vitest src/App.test.tsx |
| **Login Logic** | npx vitest src/components/\__tests\__/Login.test.tsx |
| **Dashboard Tabs** | npx vitest src/components/\__tests\__/Dashboard.test.tsx |
| **Leaderboard Rankings** | npx vitest src/components/\__tests\__/Leaderboard.test.tsx |

## 📊 Data Structures

The application interfaces with a mock database (\_DATA.ts) containing:

- **Users:** Unique IDs, names, passwords, avatar URLs, and activity logs.

- **Questions:** Timestamps, authors, and option-specific vote tracking.

## 🤝 Contributing

1. Fork the Project.

2. Create your Feature Branch (git checkout -b feature/AmazingFeature).

3. Commit your Changes (git commit -m 'Add some AmazingFeature').

4. Push to the Branch (git push origin feature/AmazingFeature).

5. Open a Pull Request.

_This project was developed as part of the Udacity React & Redux Nanodegree Program._
