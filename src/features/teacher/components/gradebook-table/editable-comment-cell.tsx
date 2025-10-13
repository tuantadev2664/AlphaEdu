'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Loader2, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface EditableCommentCellProps {
  scoreId: string;
  comment: string | null;
  onUpdate: (scoreId: string, comment: string) => Promise<void>;
  isUpdating: boolean;
  disabled?: boolean;
}

export function EditableCommentCell({
  scoreId,
  comment,
  onUpdate,
  isUpdating,
  disabled = false
}: EditableCommentCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(comment || '');
  const [isSaving, setIsSaving] = useState(false);

  // Reset value when comment changes externally
  useEffect(() => {
    setValue(comment || '');
  }, [comment]);

  const handleSave = async () => {
    if (disabled || isSaving) return;

    // Trim whitespace
    const trimmedValue = value.trim();

    // Only update if there are changes
    if (trimmedValue === (comment || '')) {
      setIsEditing(false);
      return;
    }

    // Validate comment length
    if (trimmedValue.length > 500) {
      toast.error('Comment too long', {
        description: 'Comment must be 500 characters or less',
        duration: 3000
      });
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(scoreId, trimmedValue);
      setIsEditing(false);
      toast.success('Comment updated successfully', {
        description: trimmedValue ? 'Comment saved' : 'Comment removed',
        duration: 2000
      });
    } catch (error) {
      console.error('Comment update error:', error);
      toast.error('Failed to update comment', {
        description:
          'Please try again or contact support if the issue persists',
        duration: 4000
      });
      // Reset to original value on error
      setValue(comment || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(comment || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleClick = () => {
    if (!disabled && !isUpdating && !isSaving) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className='flex min-w-0 items-start gap-2'>
        <div className='flex flex-col gap-1'>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className='h-16 w-32 resize-none text-xs'
            autoFocus
            disabled={isSaving}
            placeholder='Add a comment...'
            maxLength={500}
          />
          <div className='text-muted-foreground text-right text-xs'>
            {value.length}/500
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <Button
            size='sm'
            variant='ghost'
            onClick={handleSave}
            disabled={isSaving || value.length > 500}
            className='h-6 w-6 p-0'
          >
            {isSaving ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <CheckCircle className='h-3 w-3 text-green-600' />
            )}
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={handleCancel}
            disabled={isSaving}
            className='h-6 w-6 p-0'
          >
            <XCircle className='h-3 w-3 text-red-600' />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className='hover:bg-muted/50 min-w-0 cursor-pointer rounded p-1 text-xs sm:text-sm'
      onClick={handleClick}
    >
      {comment ? (
        <div className='flex items-start gap-1'>
          <MessageSquare className='text-muted-foreground mt-0.5 h-3 w-3 flex-shrink-0' />
          <span className='text-muted-foreground line-clamp-2 italic'>
            &ldquo;{comment}&rdquo;
          </span>
        </div>
      ) : (
        <div className='text-muted-foreground flex items-center gap-1'>
          <MessageSquare className='h-3 w-3' />
          <span className='text-xs'>Click to add comment</span>
        </div>
      )}
      {isUpdating && <Loader2 className='ml-1 h-3 w-3 animate-spin' />}
    </div>
  );
}
