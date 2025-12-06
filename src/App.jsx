import React from 'react';

function App() {
  return (
    // Outer container: full height, centered, gray background
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      {/* Inner card: white background, large padding, rounded, big shadow, hover effect */}
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full transform hover:scale-[1.02] transition-transform duration-300">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 tracking-tight">
          Tailwind CSS Success!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          If this card has a shadow, rounded corners, and colored text, the configuration is perfect.
        </p>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:translate-y-[-2px] focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Configuration Confirmed
        </button>
      </div>
    </div>
  );
}

export default App;