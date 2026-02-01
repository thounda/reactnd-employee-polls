import React from 'react';

/**
 * File: src/components/Avatar.tsx
 * Description: A reusable TypeScript component to display a user's profile picture.
 * Features:
 * - Smart fallback to UI-Avatars based on the user's name.
 * - Customizable sizing and border styles.
 * - Smooth transition animations.
 */

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

const Avatar: React.FC<AvatarProps> = ({ 
  url, 
  name, 
  size = 'w-12 h-12', 
  border = false,
  className = ''
}) => {
  // Generate a dynamic fallback based on the user's initials
  // Using a stable background color (indigo-500) for consistent branding
  const FALLBACK_URL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`;
  
  // Resolve initial source
  const [imgSrc, setImgSrc] = React.useState<string>(url || FALLBACK_URL);

  // Update source if prop changes
  React.useEffect(() => {
    setImgSrc(url || FALLBACK_URL);
  }, [url, FALLBACK_URL]);

  return (
    <div 
      className={`
        relative
        flex-shrink-0 
        rounded-full 
        overflow-hidden 
        bg-slate-100
        ${size} 
        ${border ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border border-slate-100'}
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <img
        className="w-full h-full object-cover"
        src={imgSrc}
        alt={`${name}'s avatar`}
        loading="lazy"
        onError={() => {
          // If the custom URL fails, fall back to the generated initials avatar
          if (imgSrc !== FALLBACK_URL) {
            setImgSrc(FALLBACK_URL);
          }
        }}
      />
      {/* Subtle overlay for depth to prevent "flat" look on light backgrounds */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-full" />
    </div>
  );
};

export default Avatar;