'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditableScoreCell } from './editable-score-cell';
import { EditableCommentCell } from './editable-comment-cell';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// Mock data for demo
const mockScores = [
  {
    scoreId: '1',
    score: 8.5,
    maxScore: 10,
    isAbsent: false,
    weight: 1.0,
    comment: 'Good work!'
  },
  {
    scoreId: '2',
    score: 7.0,
    maxScore: 10,
    isAbsent: false,
    weight: 1.5,
    comment: null
  },
  {
    scoreId: '3',
    score: 0,
    maxScore: 10,
    isAbsent: true,
    weight: 2.0,
    comment: 'Student was absent'
  }
];

export function InlineEditDemo() {
  const [scores, setScores] = useState(mockScores);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateScore = async (
    scoreId: string,
    newScore: number,
    isAbsent: boolean
  ) => {
    setIsUpdating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setScores((prev) =>
      prev.map((score) =>
        score.scoreId === scoreId
          ? { ...score, score: newScore, isAbsent }
          : score
      )
    );

    setIsUpdating(false);
  };

  const handleUpdateComment = async (scoreId: string, comment: string) => {
    setIsUpdating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setScores((prev) =>
      prev.map((score) =>
        score.scoreId === scoreId ? { ...score, comment } : score
      )
    );

    setIsUpdating(false);
  };

  const resetDemo = () => {
    setScores(mockScores);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Inline Edit Demo</h2>
        <Button variant='outline' size='sm' onClick={resetDemo}>
          <RefreshCw className='mr-2 h-4 w-4' />
          Reset Demo
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {scores.map((score, index) => (
          <Card key={score.scoreId}>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm'>Assessment {index + 1}</CardTitle>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='text-xs'>
                  Weight: {score.weight}
                </Badge>
                {score.isAbsent && (
                  <Badge variant='destructive' className='text-xs'>
                    Absent
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-muted-foreground mb-2 block text-xs font-medium'>
                  Score
                </label>
                <EditableScoreCell
                  score={score}
                  onUpdate={handleUpdateScore}
                  isUpdating={isUpdating}
                />
              </div>

              <div>
                <label className='text-muted-foreground mb-2 block text-xs font-medium'>
                  Comment
                </label>
                <EditableCommentCell
                  scoreId={score.scoreId}
                  comment={score.comment}
                  onUpdate={handleUpdateComment}
                  isUpdating={isUpdating}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>Instructions</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground space-y-2 text-sm'>
          <p>• Click on any score to edit it inline</p>
          <p>• Click on any comment to add or edit comments</p>
          <p>• Use Enter to save, Escape to cancel</p>
          <p>• Use Ctrl+Enter to save comments</p>
          <p>• Check the console for error handling examples</p>
        </CardContent>
      </Card>
    </div>
  );
}
