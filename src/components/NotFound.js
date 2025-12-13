/**
 * File: src/components/NotFound.js
 * Description: Component displayed for any invalid URL path (404 page).
 */
import React from 'react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600">The page you requested does not exist.</p>
    </div>
  );
}

export default NotFound;