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
import { StudentScore } from '@/features/score/type';
import { FileText } from 'lucide-react';

interface ViewScoreDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: StudentScore;
}

export function ViewScoreDetailsDialog({
  open,
  onOpenChange,
  data
}: ViewScoreDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Score Details - {data.fullName}
          </DialogTitle>
          <DialogDescription>
            View detailed scores, weights, and comments for all assessments.
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-96 space-y-4 overflow-y-auto'>
          {data.scores.map((score, index) => (
            <div key={index} className='space-y-3 rounded-lg border p-4'>
              <div className='flex items-center justify-between'>
                <h4 className='text-lg font-semibold'>
                  {score.gradeComponentName}
                </h4>
                <div className='flex items-center gap-2'>
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
                  {score.isAbsent && (
                    <span className='rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-800'>
                      ABSENT
                    </span>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
                <div>
                  <span className='text-muted-foreground font-medium'>
                    Score:
                  </span>
                  <p className='text-lg font-bold'>
                    {score.score}/{score.maxScore}
                  </p>
                  {/* <p className="text-sm text-muted-foreground">
                                        {((score.score / score.maxScore) * 100).toFixed(1)}%
                                    </p> */}
                </div>
                <div>
                  <span className='text-muted-foreground font-medium'>
                    Weight:
                  </span>
                  <p className='text-lg font-bold'>{score.weight}%</p>
                </div>
                <div>
                  <span className='text-muted-foreground font-medium'>
                    Assessment:
                  </span>
                  <p className='font-medium'>{score.assessmentName}</p>
                </div>
                {/* <div>
                                    <span className="font-medium text-muted-foreground">Position:</span>
                                    <p className="font-medium">{score.position || 'N/A'}</p>
                                </div> */}
              </div>

              {score.comment && (
                <div>
                  <span className='text-muted-foreground font-medium'>
                    Comment:
                  </span>
                  <p className='bg-muted mt-1 rounded p-2 text-sm'>
                    {score.comment}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <div className='flex w-full items-center justify-between'>
            <div className='text-muted-foreground text-sm'>
              Total Assessments: {data.scores.length}
            </div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
