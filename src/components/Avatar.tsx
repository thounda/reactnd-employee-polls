/**
 * File: src/components/Avatar.tsx
 * Description: A reusable TypeScript component to display a user's profile picture.
 * Features:
 * - Smart fallback to UI-Avatars based on the user's name.
 * - Customizable sizing and border styles.
 * - Smooth transition animations and error handling.
 */

import React, { useState, useEffect, useMemo } from 'react';

interface AvatarProps {
  /** The URL or path of the avatar image */
  url?: string;
  /** The name of the user for accessibility and fallback generation */
  name: string;
  /** Tailwind classes for dimensions, defaults to 'w-12 h-12' */
  size?: string;
  /** Optional ring/border highlight for specific UI contexts */
  border?: boolean;
  /** Additional Tailwind classes for layout positioning */
  className?: string;
}

/**
 * Avatar Component
 * Displays user profile pictures with an automatic fallback to initials-based placeholders.
 */
const Avatar: React.FC<AvatarProps> = ({ 
  url, 
  name, 
  size = 'w-12 h-12', 
  border = false,
  className = ''
}) => {
  // Generate a dynamic fallback based on the user's initials using useMemo for stability
  const fallbackUrl = useMemo(() => {
    const safeName = name.trim() || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=6366f1&color=fff&bold=true`;
  }, [name]);
  
  // State management for image source to handle loading errors
  const [imgSrc, setImgSrc] = useState<string>(url || fallbackUrl);

  // Sync state with props if the URL or fallback changes
  useEffect(() => {
    setImgSrc(url || fallbackUrl);
  }, [url, fallbackUrl]);

  return (
    <div 
      className={`
        relative
        flex-shrink-0 
        rounded-full 
        bg-slate-100
        ${size} 
        ${border ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white' : 'border border-slate-100'}
        transition-transform duration-300 ease-in-out hover:scale-[1.05]
        ${className}
      `}
    >
      <img
        className="w-full h-full object-cover rounded-full"
        src={imgSrc}
        alt={`${name}'s profile avatar`}
        loading="lazy"
        onError={() => {
          // If the custom URL fails, fall back to the generated initials avatar
          if (imgSrc !== fallbackUrl) {
            setImgSrc(fallbackUrl);
          }
        }}
      />
      
      {/* Subtle inner-ring overlay for depth. 
        This prevents the avatar from looking flat against light backgrounds. 
      */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-full" />
    </div>
  );
};

export default Avatar;