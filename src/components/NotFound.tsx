/**
 * File: src/components/NotFound.tsx
 * Description: A TypeScript functional component that renders a responsive 
 * 404 error message for invalid routing paths.
 */

import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] h-full text-center p-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you requested does not exist or has been moved.
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
}

export default NotFound;