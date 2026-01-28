/**
 * File: src/components/Avatar.tsx
 * Description: A reusable TypeScript component to display a user's profile picture.
 * It ensures consistent sizing and styling using Tailwind CSS.
 */

import React from 'react';

/**
 * Props definition for the Avatar component
 */
interface AvatarProps {
  /** The URL or path of the avatar image (e.g., '/avatars/mtsamis.png') */
  url?: string;
  /** The name of the user for accessibility alt text */
  name: string;
  /** Tailwind classes for dimensions, defaults to 'w-12 h-12' */
  size?: string;
  /** Optional ring/border highlight for specific UI contexts (like Leaderboard) */
  border?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ 
  url, 
  name, 
  size = 'w-12 h-12', 
  border = false 
}) => {
  // Constant for the fallback image
  const PLACEHOLDER_URL = "https://placehold.co/100x100/374151/ffffff?text=User";
  
  // Resolve the image source
  const imageUrl = url || PLACEHOLDER_URL;

  return (
    <div 
      className={`
        flex-shrink-0 
        rounded-full 
        overflow-hidden 
        shadow-sm 
        bg-gray-200
        ${size} 
        ${border ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border border-gray-100'}
        transition-transform duration-200
      `}
    >
      <img
        className="w-full h-full object-cover"
        src={imageUrl}
        alt={`${name}'s avatar`}
        /**
         * Error handler for broken local paths.
         * Note: If url is 'public/avatars/...', browser may need it as '/avatars/...'
         */
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          const target = e.currentTarget;
          if (target.src !== PLACEHOLDER_URL) {
            target.onerror = null; // Clean up listener
            target.src = PLACEHOLDER_URL;
          }
        }}
      />
    </div>
  );
};

export default Avatar;