import React, { useState } from 'react';
import { HiStar } from 'react-icons/hi';

const StarRating = ({ value = 0, onChange, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

  const display = hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform duration-100 ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          <HiStar
            className={`${sizes[size]} transition-colors duration-100 ${
              star <= display
                ? 'text-amber-400'
                : 'text-gray-300 dark:text-ink-2'
            }`}
          />
        </button>
      ))}
      {!readonly && value > 0 && (
        <span className="ml-1.5 text-sm text-ink-2">{value}/5</span>
      )}
    </div>
  );
};

export default StarRating;
