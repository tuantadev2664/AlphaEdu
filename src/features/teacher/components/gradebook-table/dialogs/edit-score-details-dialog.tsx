'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateScore } from '@/features/score/hooks/use-score.query';
import { StudentScore } from '@/features/score/type';
import { Edit3 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EditScoreDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: StudentScore;
}

export function EditScoreDetailsDialog({
  open,
  onOpenChange,
  data
}: EditScoreDetailsDialogProps) {
  const updateScoreMutation = useUpdateScore();
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const handleInputChange = (scoreIndex: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [`${scoreIndex}_${field}`]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Process each score that has changes
      const updates = data.scores
        .map(async (score, index) => {
          const scoreValue = formData[`${index}_score`];
          const isAbsent = formData[`${index}_isAbsent`];
          const comment = formData[`${index}_comment`];

          // Only update if there are changes
          if (
            scoreValue !== undefined ||
            isAbsent !== undefined ||
            comment !== undefined
          ) {
            return updateScoreMutation.mutateAsync({
              scoreId: score.scoreId,
              data: {
                score1:
                  scoreValue !== undefined ? Number(scoreValue) : score.score,
                isAbsent: isAbsent !== undefined ? isAbsent : score.isAbsent,
                comment: comment !== undefined ? comment : score.comment || ''
              }
            });
          }
        })
        .filter(Boolean);

      await Promise.all(updates);

      toast.success('Scores Updated', {
        description: `Scores have been updated for ${data.fullName}`,
        duration: 3000
      });

      onOpenChange(false);
    } catch (error) {
      toast.error('Update Failed', {
        description: 'Failed to update scores. Please try again.',
        duration: 3000
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Edit3 className='h-5 w-5' />
            Edit Details Score - {data.fullName}
          </DialogTitle>
          <DialogDescription>
            Edit scores, add comments, and set attendance for individual
            assessments.
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-96 space-y-4 overflow-y-auto'>
          {data.scores.map((score, index) => (
            <div key={index} className='space-y-4 rounded-lg border p-4'>
              <div className='flex items-center justify-between'>
                <h4 className='text-lg font-semibold'>
                  {score.gradeComponentName}
                </h4>
                <span
                  className={`rounded px-2 py-1 text-sm font-medium ${
                    score.kind === 'quiz'
                      ? 'bg-blue-100 text-blue-800'
                      : score.kind === 'test'
                        ? 'bg-green-100 text-green-800'
                        : score.kind === 'midterm'
                          ? 'bg-orange-100 text-orange-800'
                          : score.kind === 'final'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {score.kind.toUpperCase()}
                </span>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                  <Label htmlFor={`score-${index}`}>
                    Score (max: {score.maxScore})
                  </Label>
                  <Input
                    id={`score-${index}`}
                    type='number'
                    min='0'
                    max={score.maxScore}
                    defaultValue={score.score}
                    onChange={(e) =>
                      handleInputChange(index, 'score', e.target.value)
                    }
                    placeholder={`Enter score (0-${score.maxScore})`}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`weight-${index}`}>Weight (%)</Label>
                  <Input
                    id={`weight-${index}`}
                    type='number'
                    min='0'
                    max='100'
                    defaultValue={score.weight}
                    disabled
                    placeholder='Enter weight'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      defaultChecked={score.isAbsent}
                      onChange={(e) =>
                        handleInputChange(index, 'isAbsent', e.target.checked)
                      }
                      className='rounded'
                    />
                    Mark as Absent
                  </Label>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`comment-${index}`}>Comment (Optional)</Label>
                <Textarea
                  id={`comment-${index}`}
                  defaultValue={score.comment || ''}
                  placeholder='Add a comment about this assessment...'
                  rows={2}
                  onChange={(e) =>
                    handleInputChange(index, 'comment', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
