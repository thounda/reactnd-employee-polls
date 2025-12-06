/**
 * File: src/components/Avatar.js
 * Description: A reusable component to display a user's profile picture.
 * It ensures consistent sizing and styling across the application.
 */
import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.url - The URL of the avatar image.
 * @param {string} props.name - The name of the user (used for alt text).
 * @param {string} [props.size='w-12 h-12'] - Tailwind classes for size (e.g., 'w-8 h-8', 'w-16 h-16').
 * @returns {JSX.Element}
 */
function Avatar({ url, name, size = 'w-12 h-12' }) {
  // Use a placeholder image if the URL is missing or invalid for robustness.
  const imageUrl = url || "https://placehold.co/100x100/374151/ffffff?text=User"; 

  return (
    <div className={`flex-shrink-0 rounded-full overflow-hidden shadow-md ${size}`}>
      <img
        className="w-full h-full object-cover"
        src={imageUrl}
        alt={`${name}'s avatar`}
        // Simple error handler in case the image path in _DATA.js is incorrect
        onError={(e) => {
          e.target.onerror = null; // Prevents infinite loop
          e.target.src = "https://placehold.co/100x100/374151/ffffff?text=User";
        }}
      />
    </div>
  );
}

export default Avatar;