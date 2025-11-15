"use client";

import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useToast } from '@/components/ui/toast-1';
import { clsx } from 'clsx'; 

interface LikeButtonProps {
  projectId: string;
  isInitiallyLiked: boolean;
  initialLikeCount: number; 
  disabled?: boolean;
}

const LikeButton = ({
  projectId,
  isInitiallyLiked,
  initialLikeCount,
  disabled = false,
}: LikeButtonProps) => {
  // --- STATE FOR BOTH ICON AND COUNT ---
  const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showToast } = useToast();

  const toggleLike = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    
    // --- 1. STORE PREVIOUS STATE FOR ROLLBACK ---
    const previousLikeState = isLiked;
    const previousLikeCount = likeCount;

    // --- 2. OPTIMISTIC UPDATE ---
    // Update both the icon and the count immediately
    setIsLiked(!previousLikeState);
    setLikeCount(previousLikeState ? previousLikeCount - 1 : previousLikeCount + 1);

    try {
      // 3. API CALL (same as before)
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

    } catch (error) {
      console.error(error);

      // --- 4. ROLLBACK ON ERROR ---
      // If the API call fails, revert both states
      setIsLiked(previousLikeState);
      setLikeCount(previousLikeCount);
      showToast('Failed to update like status', 'error');

    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || disabled;

  // --- 5. RENDER BOTH BUTTON AND COUNT ---
  // We wrap them in the div that was in your page.tsx
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <button
        onClick={toggleLike}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center transition-opacity h-4 w-4', // Added h-4 w-4
          {
            'cursor-not-allowed opacity-70': isDisabled,
            'cursor-pointer': !isDisabled,
          }
        )}
        aria-label={
          disabled ? 'Login to like' : isLiked ? 'Unlike' : 'Like'
        }
      >
        {isLiked ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-current" />
        )}
      </button>
      
      {/* Render the likeCount state, which updates instantly */}
      <span className="text-sm font-medium">{likeCount}</span>
    </div>
  );
};

export default LikeButton;