'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface EditableScoreCellProps {
  score: {
    scoreId: string;
    score: number;
    maxScore: number;
    isAbsent: boolean;
    weight: number;
  };
  onUpdate: (
    scoreId: string,
    newScore: number,
    isAbsent: boolean
  ) => Promise<void>;
  isUpdating: boolean;
  disabled?: boolean;
}

export function EditableScoreCell({
  score,
  onUpdate,
  isUpdating,
  disabled = false
}: EditableScoreCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(score.score.toString());
  const [isAbsent, setIsAbsent] = useState(score.isAbsent);
  const [isSaving, setIsSaving] = useState(false);

  // Reset value when score changes externally
  useEffect(() => {
    setValue(score.score.toString());
    setIsAbsent(score.isAbsent);
  }, [score.score, score.isAbsent]);

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 70)
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const handleSave = async () => {
    if (disabled || isSaving) return;

    const newScore = parseFloat(value);

    // Validation
    if (isNaN(newScore)) {
      toast.error('Invalid input', {
        description: 'Please enter a valid number',
        duration: 3000
      });
      return;
    }

    if (newScore < 0) {
      toast.error('Invalid score', {
        description: 'Score cannot be negative',
        duration: 3000
      });
      return;
    }

    if (newScore > score.maxScore) {
      toast.error('Invalid score', {
        description: `Score cannot exceed maximum score of ${score.maxScore}`,
        duration: 3000
      });
      return;
    }

    // Only update if there are changes
    if (newScore === score.score && isAbsent === score.isAbsent) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(score.scoreId, newScore, isAbsent);
      setIsEditing(false);
      toast.success('Score updated successfully', {
        description: `${newScore}/${score.maxScore} ${isAbsent ? '(Absent)' : ''}`,
        duration: 2000
      });
    } catch (error) {
      console.error('Score update error:', error);
      toast.error('Failed to update score', {
        description:
          'Please try again or contact support if the issue persists',
        duration: 4000
      });
      // Reset to original values on error
      setValue(score.score.toString());
      setIsAbsent(score.isAbsent);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(score.score.toString());
    setIsAbsent(score.isAbsent);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
      <div className='flex min-w-0 items-center gap-1'>
        <div className='flex flex-col gap-1'>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className='h-7 w-16 text-center text-xs'
            autoFocus
            disabled={isSaving}
            type='number'
            min='0'
            max={score.maxScore}
            step='0.1'
          />
          <div className='flex items-center gap-1'>
            <input
              type='checkbox'
              checked={isAbsent}
              onChange={(e) => setIsAbsent(e.target.checked)}
              disabled={isSaving}
              className='h-3 w-3'
            />
            <span className='text-muted-foreground text-xs'>Absent</span>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <Button
            size='sm'
            variant='ghost'
            onClick={handleSave}
            disabled={isSaving}
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

  if (isAbsent) {
    return (
      <div
        className='hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded p-1'
        onClick={handleClick}
      >
        <Badge variant='destructive' className='text-xs'>
          Absent
        </Badge>
      </div>
    );
  }

  return (
    <div
      className={`hover:bg-muted/50 inline-flex cursor-pointer items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium transition-colors ${getScoreColor(score.score, score.maxScore)}`}
      onClick={handleClick}
    >
      <span>
        {score.score}/{score.maxScore}
      </span>
      {isUpdating && <Loader2 className='h-3 w-3 animate-spin' />}
    </div>
  );
}
