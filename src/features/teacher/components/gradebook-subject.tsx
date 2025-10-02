'use client';

import { Button } from '@/components/ui/button';
import { GradebookTable } from '@/features/teacher/components/gradebook-table/index';
import { Edit, Plus } from 'lucide-react';
import { useGradebook } from '@/features/score/hooks/use-score.query';
import { useClassDetails } from '@/features/class/hooks/use-class.query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateScore } from '@/features/score/hooks/use-score.query';
import { createColumns } from './gradebook-table/columns';
import {
  ViewScoreDetailsDialog,
  EditScoreDetailsDialog,
  BulkUpdateScoresDialog
} from './gradebook-table/dialogs';
import { StudentScore } from '@/features/score/type';
import { AddAssessmentDialog } from './gradebook-table/dialogs/add-assessment-dialog';

interface GradebookSubjectProps {
  classId: string;
  subjectId: string;
}

export default function GradebookSubject({
  classId,
  subjectId
}: GradebookSubjectProps) {
  // Dialog states
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentScore | null>(
    null
  );
  const [addAssessmentOpen, setAddAssessmentOpen] = useState(false);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const updateScoreMutation = useUpdateScore();

  // Dialog handlers
  const handleViewDetails = (student: StudentScore) => {
    setSelectedStudent(student);
    setViewDetailsOpen(true);
  };

  const handleEditDetails = (student: StudentScore) => {
    setSelectedStudent(student);
    setEditDetailsOpen(true);
  };
  // Fetch class details to get subject information
  const { data: classDetails, isLoading: classLoading } = useClassDetails({
    classId,
    academicYearId: '22222222-2222-2222-2222-222222222222'
  });

  // Fetch gradebook data (scores, stats, student stats)
  const {
    scores,
    stats,
    studentStats,
    isLoading: gradebookLoading,
    isError,
    error
  } = useGradebook({
    classId,
    subjectId,
    termId: '33333333-3333-3333-3333-333333333333' // Default term ID
  });

  // Find subject data from class details
  const subjectData = classDetails?.subjects.find(
    (s) => s.subjectId === subjectId
  );
  const gradebookData = scores.data || [];
  const isLoading = classLoading || gradebookLoading;

  // Create columns dynamically based on score data
  const columns = useMemo(() => {
    return gradebookData.length > 0
      ? createColumns({
          studentScores: gradebookData,
          onViewDetails: handleViewDetails,
          onEditDetails: handleEditDetails
        })
      : [];
  }, [gradebookData]);

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {/* Header Skeleton */}
        <div className='flex items-center justify-between'>
          <div className='bg-muted h-6 w-64 animate-pulse rounded' />
        </div>

        {/* Actions Skeleton */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='bg-muted h-8 w-32 animate-pulse rounded' />
            <div className='bg-muted h-8 w-32 animate-pulse rounded' />
            <div className='bg-muted h-8 w-36 animate-pulse rounded' />
          </div>
          <div className='bg-muted h-4 w-24 animate-pulse rounded' />
        </div>

        {/* Table Skeleton */}
        <div className='rounded-lg border'>
          <div className='bg-muted/50 h-12 border-b' />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='bg-muted/20 h-16 animate-pulse border-b' />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !classDetails) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Gradebook</h2>
        </div>
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>
            {error?.message || 'Failed to load gradebook data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-6 pb-36'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>
            Gradebook - {subjectData?.subjectName} ({subjectData?.teacherName})
          </h2>
        </div>

        {/* Statistics Summary */}
        {stats.data && (
          <div className='bg-muted/50 grid grid-cols-2 gap-4 rounded-lg p-4 md:grid-cols-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {stats.data.average.toFixed(1)}
              </div>
              <div className='text-muted-foreground text-sm'>Class Average</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {stats.data.highest.toFixed(1)}
              </div>
              <div className='text-muted-foreground text-sm'>Highest Score</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {stats.data.lowest.toFixed(1)}
              </div>
              <div className='text-muted-foreground text-sm'>Lowest Score</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {stats.data.passRate.toFixed(1)}%
              </div>
              <div className='text-muted-foreground text-sm'>Pass Rate</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setBulkUpdateOpen(true)}
            >
              <Edit className='mr-2 h-4 w-4' />
              Bulk Update Scores
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setAddAssessmentOpen(true)}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Assessment
            </Button>
          </div>

          <div className='text-muted-foreground text-sm'>
            Showing {gradebookData.length} students
            {stats.data && ` • ${stats.data.totalStudents} total`}
          </div>
        </div>

        {/* Gradebook Table */}
        <GradebookTable
          data={gradebookData}
          totalItems={gradebookData.length}
          columns={columns}
          classId={classId}
          subjectId={subjectId}
        />

        {gradebookData.length === 0 && !isLoading && (
          <div className='py-8 text-center'>
            <p className='text-muted-foreground'>
              No score data found for this subject
            </p>
          </div>
        )}

        {/* Dialogs */}
        {selectedStudent && (
          <>
            <ViewScoreDetailsDialog
              open={viewDetailsOpen}
              onOpenChange={setViewDetailsOpen}
              data={selectedStudent}
            />
            <EditScoreDetailsDialog
              open={editDetailsOpen}
              onOpenChange={setEditDetailsOpen}
              data={selectedStudent}
            />
          </>
        )}

        <BulkUpdateScoresDialog
          open={bulkUpdateOpen}
          onOpenChange={setBulkUpdateOpen}
          data={gradebookData}
        />
      </div>
      <AddAssessmentDialog
        open={addAssessmentOpen}
        onOpenChange={setAddAssessmentOpen}
        classId={classId}
        subjectId={subjectId}
        termId='33333333-3333-3333-3333-333333333333' // Current term
        academicYearId='22222222-2222-2222-2222-222222222222' // Current academic year
      />
    </>
  );
}
