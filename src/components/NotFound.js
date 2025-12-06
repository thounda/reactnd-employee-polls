/**
 * File: src/components/NotFound.js
 * Description: The 404 page displayed when a route is not found.
 */
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-2xl max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-wider">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Page Not Found</p>
        <p className="text-lg text-gray-500">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;