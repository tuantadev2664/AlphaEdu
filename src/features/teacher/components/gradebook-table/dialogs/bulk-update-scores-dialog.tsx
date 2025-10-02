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
import { useUpdateScore } from '@/features/score/hooks/use-score.query';
import { StudentScore, Score } from '@/features/score/type';
import { Edit, Save, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BulkUpdateScoresDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: StudentScore[];
}

interface ScoreUpdate {
  scoreId: string;
  score?: number;
}

export function BulkUpdateScoresDialog({
  open,
  onOpenChange,
  data
}: BulkUpdateScoresDialogProps) {
  const updateScoreMutation = useUpdateScore();
  const [updates, setUpdates] = useState<{ [key: string]: ScoreUpdate }>({});

  // Get all unique assessments across all students
  const assessments = useMemo(() => {
    const assessmentMap = new Map<string, Score>();
    data.forEach((student) => {
      student.scores.forEach((score) => {
        if (!assessmentMap.has(score.gradeComponentId)) {
          assessmentMap.set(score.gradeComponentId, score);
        }
      });
    });
    return Array.from(assessmentMap.values()).sort(
      (a, b) => (a.position || 0) - (b.position || 0)
    );
  }, [data]);

  const handleScoreChange = (
    studentId: string,
    scoreId: string,
    value: number | undefined
  ) => {
    const key = `${studentId}_${scoreId}`;
    setUpdates((prev) => ({
      ...prev,
      [key]: {
        scoreId,
        score: value
      }
    }));
  };

  const getScoreForStudent = (
    studentId: string,
    gradeComponentId: string
  ): Score | undefined => {
    const student = data.find((s) => s.studentId === studentId);
    return student?.scores.find((s) => s.gradeComponentId === gradeComponentId);
  };

  const getScoreValue = (
    studentId: string,
    scoreId: string,
    defaultValue: number
  ) => {
    const key = `${studentId}_${scoreId}`;
    const update = updates[key];
    return update?.score !== undefined ? update.score : defaultValue;
  };

  const handleSave = async () => {
    try {
      const updatePromises = Object.values(updates)
        .filter((update) => update.score !== undefined)
        .map((update) => {
          const originalScore = data
            .flatMap((s) => s.scores)
            .find((s) => s.scoreId === update.scoreId);

          return updateScoreMutation.mutateAsync({
            scoreId: update.scoreId,
            data: {
              score1: Number(update.score),
              isAbsent: originalScore?.isAbsent || false,
              comment: originalScore?.comment || ''
            }
          });
        });

      if (updatePromises.length === 0) {
        toast.error('Không có thay đổi nào để lưu');
        return;
      }

      await Promise.all(updatePromises);

      toast.success('Cập nhật thành công', {
        description: `Đã cập nhật ${updatePromises.length} điểm số`,
        duration: 3000
      });

      setUpdates({});
      onOpenChange(false);
    } catch (error) {
      toast.error('Cập nhật thất bại', {
        description: 'Vui lòng thử lại sau',
        duration: 3000
      });
    }
  };

  const handleCancel = () => {
    setUpdates({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-[85vh] min-w-[1500px]'>
        <div className='flex h-full flex-col'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Edit className='h-5 w-5' />
              Bulk Update Scores
            </DialogTitle>
            <DialogDescription>
              Update scores for multiple students at once. Only modified scores
              will be saved.
            </DialogDescription>
          </DialogHeader>

          <div className='h-[calc(100%-64px)] min-w-0 flex-1 overflow-x-auto overflow-y-auto'>
            <div className='min-w-0'>
              {/* Build consistent grid columns for header and rows */}
              {(() => {
                const dynamicColumns = assessments
                  .map(() => 'minmax(150px,1fr)')
                  .join(' ');
                const gridTemplateColumns = `200px ${dynamicColumns}`;

                return (
                  <>
                    {/* Header */}
                    <div
                      className='bg-background sticky top-0 z-10 grid gap-2 border-b p-2 font-semibold'
                      style={{ gridTemplateColumns }}
                    >
                      <div>Student Name</div>
                      {assessments.map((assessment) => (
                        <div
                          key={assessment.gradeComponentId}
                          className='text-center'
                        >
                          <div className='font-medium'>
                            {assessment.gradeComponentName}
                          </div>
                          <div className='text-muted-foreground text-xs'>
                            Max: {assessment.maxScore} |{' '}
                            {assessment.kind.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Student Rows */}
                    {data.map((student) => (
                      <div
                        key={student.studentId}
                        className='hover:bg-muted/50 grid gap-2 border-b p-2'
                        style={{ gridTemplateColumns }}
                      >
                        <div className='flex items-center font-medium'>
                          {student.fullName}
                        </div>

                        {assessments.map((assessment) => {
                          const score = getScoreForStudent(
                            student.studentId,
                            assessment.gradeComponentId
                          );
                          const scoreId = score?.scoreId || '';

                          return (
                            <div
                              key={assessment.gradeComponentId}
                              className='flex items-center justify-center'
                            >
                              {score ? (
                                <Input
                                  type='number'
                                  min='0'
                                  max={assessment.maxScore}
                                  placeholder={`0-${assessment.maxScore}`}
                                  value={
                                    getScoreValue(
                                      student.studentId,
                                      scoreId,
                                      score.score
                                    ) || ''
                                  }
                                  onChange={(e) =>
                                    handleScoreChange(
                                      student.studentId,
                                      scoreId,
                                      e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                    )
                                  }
                                  className='h-8 text-center text-sm'
                                />
                              ) : (
                                <div className='text-muted-foreground py-2 text-center text-xs'>
                                  No record
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={handleCancel}>
              <X className='mr-2 h-4 w-4' />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className='mr-2 h-4 w-4' />
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
